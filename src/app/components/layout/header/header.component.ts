import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../services/login.service';
import {FriendshipService} from '../../../services/friendship.service';
import {Friendship} from '../../../models/friendship';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  friendsRequestsNumber = 0;
  friendsRequestList: Friendship[] = [];
  currentUser = this.ls.currentUserValue.username;
  // @ts-ignore
  interval: NodeJS.Timeout;

  constructor(private ls: LoginService,
              private friendshipService: FriendshipService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.callApi();
    }, 20000);
  }

  callApi(): void {
    this.friendshipService.getFriendships(this.currentUser, 'true', 'true').subscribe(resp => {
      this.friendsRequestList = resp;
      if (this.friendsRequestList !== null) {
        this.friendsRequestsNumber = this.friendsRequestList.length;
      }
    }, () => {
      this.notificationService.createNotification('Friendship requests update unsuccessful.');
    });
  }

  Logout(): void {
    clearInterval(this.interval);
    this.ls.logout();
  }
}
