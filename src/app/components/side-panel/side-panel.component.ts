import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {LoginService} from '../../services/login.service';
import {FriendshipService} from '../../services/friendship.service';
import {Friendship} from '../../models/friendship';
import {GameService} from '../../services/game.service';
import {UpdateUserStatus} from '../../models/updateUserStatus';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy {
  onlineUsers: User[] = [];
  currentUser = this.loginService.currentUserValue.username;
  currentUserStatus: UpdateUserStatus = {username: this.currentUser, online: true, inGame: false};
  friendshipsList: Friendship[] = [];
  friendList: string[] = [];
  usernames: string[] = [];
  friendListStatus: UpdateUserStatus[] = [];
  usernameListStatus: UpdateUserStatus[] = [];
  subscriptions: Subscription[] = [];
  message: any;
  wsStatus = new WebSocket('ws://localhost:8081/api/status');

  constructor(private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService,
              private gameService: GameService,
              private notificationService: NotificationService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.wsStatus.close();
  }

  ngOnInit(): void {
    this.wsStatus.onmessage = (message) => {
      const status: UpdateUserStatus = JSON.parse(message.data);
      if (this.currentUserStatus.username === status.username) {
        this.currentUserStatus = status;
      }

      if (this.usernameListStatus !== null) {
        this.usernameListStatus.forEach((user, index) => {
          if (user.username === status.username) {
            this.usernameListStatus[index] = status;
          }
        });
      }
      if (this.friendListStatus !== null) {
        this.friendListStatus.forEach((user, index) => {
          if (user.username === status.username) {
            this.friendListStatus[index] = status;
          }
        });
      }
    };
    this.subscriptions.push(this.friendshipService.getFriendships(this.currentUser, 'false', '').subscribe(resp => {
      this.friendshipsList = resp;
      this.friendList = this.modifyFriendshipToUsernames(this.friendshipsList);
    }, () => {
      this.notificationService.createNotification('Error getting your friendships.');

    }));
    this.subscriptions.push(this.userService.getUsers(true).subscribe(resp => {
        this.onlineUsers = resp;
        // Pop current user
        if (this.onlineUsers !== null) {
          this.onlineUsers.forEach((user) =>
            this.usernames.push(user.username)
          );
          this.usernames = this.difference(this.usernames, this.friendList);
          this.friendListStatus = this.mapListToStatus(this.friendList);
          this.usernameListStatus = this.mapListToStatus(this.usernames);
        }
      },
      () => {
        this.notificationService.createNotification('Error getting online users.');
      }
    ));


  }

  askForFriendship(user1: string, user2: string): void {
    this.subscriptions.push(this.friendshipService.createFriendship(user1, user2).subscribe(() => {
      alert('Asked for friendship!');
    }, () => {
      this.notificationService.createNotification('Asking for friendship unsuccessful.');
    }));
  }

  mapListToStatus(list: string[]): UpdateUserStatus[] {
    const newList: UpdateUserStatus[] = [];
    if (list !== null) {
      list.forEach((username) => {
        const user: UpdateUserStatus = {username, inGame: false, online: true};
        newList.push(user);
      });
    }
    return newList;
  }

  modifyFriendshipToUsernames(list: Friendship[]): string[] {
    const resultList: string[] = [];
    if (list !== null) {
      list.forEach((friendship) => {
        if (friendship.user1 === this.currentUser) {
          resultList.push(friendship.user2);
        }
        if (friendship.user2 === this.currentUser) {
          resultList.push(friendship.user1);
        }
      });
    }
    return resultList;
  }

  difference(a1: string[], a2: string[]): string[] {
    const result = [];
    for (const item of a1) {
      if (a2.indexOf(item) === -1) {
        if (item !== this.currentUser) {
          result.push(item);
        }
      }
    }
    return result;
  }

  inviteUser(user: string): void {
    this.subscriptions.push(this.gameService.createGame(this.currentUser, user).subscribe(() => {
      }, () =>
        this.notificationService.createNotification('Error getting your friendships.')
    ));
  }
}
