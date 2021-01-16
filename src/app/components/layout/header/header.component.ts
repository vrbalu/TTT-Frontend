import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private ls: LoginService) {
    this.username = this.ls.currentUserValue.username
  }

  ngOnInit(): void {
  }

  Logout(): void {
    this.ls.logout()
  }
}
