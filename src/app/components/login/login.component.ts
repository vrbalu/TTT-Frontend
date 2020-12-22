import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  constructor(private authService: SocialAuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData) => {
      //on success
      //this will return user data from google. What you need is a user token which you will send it to the server
      this.sendToRestApiMethod(userData);
    });
  }

  private sendToRestApiMethod(userData: SocialUser): void {
    this.http.post("http://localhost:8081/api/callback",
      {userData}).subscribe(
    onSuccess => {
  //login was successful
  //save the token that you got from your REST API in your preferred location i.e. as a Cookie or LocalStorage as you do with normal login
}, onFail => {
  //login was unsuccessful
  //show an error message
}
);
  }
}
