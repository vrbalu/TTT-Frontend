import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {LoginService} from "../../services/login.service";
import {FriendshipService} from "../../services/friendship.service";
import {Friendship} from "../../models/friendship";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  onlineUsers: User[] = [];
  currentUser = this.loginService.currentUserValue
  friendshipsList: Friendship[] = [];
  friendList: string[] = [];
  usernames: string[] = [];
  constructor(private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService) {
  }

  ngOnInit(): void {
    this.friendshipService.getFriendships(this.currentUser.username, "false", "").subscribe(resp => {
      this.friendshipsList = resp;
      this.friendList = this.modifyFriendshipToUsernames(this.friendshipsList)
    })
    this.userService.getUsers(true).subscribe(resp => {
        this.onlineUsers = resp
        // Pop current user

        this.onlineUsers.forEach((user,index) =>
        this.usernames.push(user.username)
      )
      this.usernames = this.difference(this.usernames,this.friendList)
      }
    )

  }

  askForFriendship(user1: string, user2: string): void {
    this.friendshipService.createFriendship(user1, user2).subscribe(resp => {
      alert("Asked for friendship!")
    });
  }

  modifyFriendshipToUsernames(list: Friendship[]): string[] {
    let resultList: string[] = [];
    list.forEach((friendship, index) => {
      if (friendship.user1 === this.currentUser.username) {
        resultList.push(friendship.user2)
      }
      if (friendship.user2 === this.currentUser.username) {
        resultList.push(friendship.user1)
      }

    });
    return resultList
  }
  difference(a1: string[], a2:string[]): string[] {
    let result = [];
    for (let i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        if (a1[i] !== this.currentUser.username){
          result.push(a1[i]);
        }
      }
    }
    return result;
  }
}
