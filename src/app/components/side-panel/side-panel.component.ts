import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {LoginService} from "../../services/login.service";
import {FriendshipService} from "../../services/friendship.service";
import {Friendship} from "../../models/friendship";
import {GameService} from "../../services/game.service";
import {Game} from "../../models/game";
import {UpdateUserStatus} from "../../models/updateUserStatus";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy {
  onlineUsers: User[] = [];
  currentUser = this.loginService.currentUserValue.username
  currentUserStatus: UpdateUserStatus = {username:this.currentUser,online:true,inGame:false}
  friendshipsList: Friendship[] = [];
  friendList: string[] = [];
  usernames: string[] = [];
  friendListStatus: UpdateUserStatus[] = []
  usernameListStatus: UpdateUserStatus[] = []
  subscriptions: Subscription[] = [];
  message: any;
  wsStatus = new WebSocket('ws://localhost:8081/api/status')
  constructor(private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService,
              private gameService: GameService) {
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>subscription.unsubscribe())
    this.wsStatus.close()
  }

  ngOnInit(): void {
    this.wsStatus.onmessage = (message) => {
      let status: UpdateUserStatus = JSON.parse(message.data);
      if (this.currentUserStatus.username === status.username){
        this.currentUserStatus = status;
      }

      if (this.usernameListStatus !== null){
        this.usernameListStatus.forEach((user,index) => {
          if (user.username === status.username) {
            this.usernameListStatus[index] = status;
          }
        })
      }
      if (this.friendListStatus !== null){
        this.friendListStatus.forEach((user,index) => {
          if (user.username === status.username) {
            this.friendListStatus[index] = status;
          }
        })
      }
    }
    this.subscriptions.push(this.friendshipService.getFriendships(this.currentUser, "false", "").subscribe(resp => {
      this.friendshipsList = resp;
      this.friendList = this.modifyFriendshipToUsernames(this.friendshipsList);
    }))
    this.subscriptions.push(this.userService.getUsers(true).subscribe(resp => {
        this.onlineUsers = resp
        // Pop current user
        if (this.onlineUsers !== null){
        this.onlineUsers.forEach((user,index) =>
        this.usernames.push(user.username)
      )
      this.usernames = this.difference(this.usernames,this.friendList)
          this.friendListStatus = this.mapListToStatus(this.friendList)
          this.usernameListStatus = this.mapListToStatus(this.usernames)
      }
      }))


  }

  askForFriendship(user1: string, user2: string): void {
    this.subscriptions.push(this.friendshipService.createFriendship(user1, user2).subscribe(resp => {
      alert("Asked for friendship!")
    }));
  }
  mapListToStatus(list: string[]): UpdateUserStatus[]{
    let newList: UpdateUserStatus[] = []
    if (list !== null){
      list.forEach((username, index) => {
      let user: UpdateUserStatus = {username:username,inGame:false,online:true}
      newList.push(user)
      })
    }
    return newList
  }
  modifyFriendshipToUsernames(list: Friendship[]): string[] {
    let resultList: string[] = [];
    if (list !== null){
    list.forEach((friendship, index) => {
      if (friendship.user1 === this.currentUser) {
        resultList.push(friendship.user2)
      }
      if (friendship.user2 === this.currentUser) {
        resultList.push(friendship.user1)
      }
    });
    }
    return resultList
  }
  difference(a1: string[], a2:string[]): string[] {
    let result = [];
    for (let i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        if (a1[i] !== this.currentUser){
          result.push(a1[i]);
        }
      }
    }
    return result;
  }

  inviteUser(user: string) {
    this.subscriptions.push(this.gameService.createGame(this.currentUser,user).subscribe(res =>{
      console.log(res)
    }))
  }
}
