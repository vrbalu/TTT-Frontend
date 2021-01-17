import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {LoginService} from "../../services/login.service";
import {Observable} from "rxjs";
import {FriendshipCreate} from "../../models/friendshipCreate";
import {FriendshipService} from "../../services/friendship.service";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  onlineUsers: User[] = [];
  currentUser: User
  constructor(private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService) {
    this.currentUser = this.loginService.currentUserValue
  }

  ngOnInit(): void {
    // TODO Error handling
    this.userService.getUsers(true).subscribe(resp =>{
      this.onlineUsers = resp
      // Pop current user
      this.onlineUsers.forEach( (item, index) => {
        if(item.username === this.currentUser.username) this.onlineUsers.splice(index,1);
      });
      }

    )

  }
  askForFriendship(user1: string, user2: string): void {
    this.friendshipService.createFriendship(user1,user2).subscribe(resp => {
      alert("Asked for friendship!")
    });
  }

}
