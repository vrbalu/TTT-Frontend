import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {
  onlineUsers: User[] = [];

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    // TODO Error handling
    this.userService.getUsers(true).subscribe(resp =>
      this.onlineUsers = resp)

  }

}
