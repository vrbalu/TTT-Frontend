import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  formGroup = new FormGroup({})
  constructor(private loginService: LoginService,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              private router: Router,
              private soucialAuth: SocialAuthService) {
    if (this.loginService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEX)])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  signInWithGoogle(): void {
    this.soucialAuth.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData) => {
      //on success
      //this will return user data from google. What you need is a user token which you will send it to the server
      this.loginService.googleLoginCallBack(userData).subscribe(
        res => {
          let u: User = (<User>res)
          localStorage.setItem('currentUser', JSON.stringify(u));
          this.loginService.currentUserSubject.next(u);
          this.router.navigate(['/'])
        }, err => {
          //show error message
        }
      );
    });
  }
  onLoginClick(): void {
    console.log(JSON.stringify(this.formGroup.getRawValue()))
    this.loginService.classicLogin(JSON.stringify(this.formGroup.getRawValue())).subscribe(
      res => {
        let u: User = (<User>res)
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.loginService.currentUserSubject.next(u);
        this.router.navigate(['/'])}, err => {
        //show error message
      }
    );
  };

}
