import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {Friendship} from "../../models/friendship";
import {FriendshipService} from "../../services/friendship.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  formGroup: FormGroup;
  PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  showSuccessAlert = false;
  showDangerAlert = false;
  successAlertText = "Password successfully changed.";
  dangerAlertText = "There was an error changing, please try again."
  friendsRequestList: Friendship[] = [];
  friendsList: Friendship[] = [];
  currentUser = this.loginService.currentUserValue.username;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService,
              private friendshipService2: FriendshipService) {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required,Validators.pattern(this.PASSWORD_REGEX)])],
      passwordConfirmed: ['', Validators.compose([Validators.required,Validators.pattern(this.PASSWORD_REGEX)])],
    },{validator: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.getFriends()
  }
  onChange(): void {
    this.getFriends()
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['passwordConfirmed'].value ? null : { matching: true};
  }
  onSubmit(): void {
    console.log(this.formGroup.value)
    this.userService.changePassword(this.loginService.currentUserValue.email,this.formGroup.value,).subscribe(() => {
      this.showSuccessAlert = true;
      this.formGroup.reset();
    }, () => {
      this.showDangerAlert = true;
    });
  }
  getFriends(){
    this.friendshipService2.getFriendships(this.currentUser,"false","").subscribe(resp2 =>{
      this.friendsList = resp2
      this.friendshipService.getFriendships(this.currentUser,"true","true").subscribe(resp =>{
        this.friendsRequestList = resp
      });
    });
  }
  onXClick() {
    this.showDangerAlert = false;
    this.showSuccessAlert = false
  }

  acceptFriendRequest(id: string) {
    this.friendshipService.updateFriendshipStatus(id,"false").subscribe(() =>{
     this.onChange()
    })

  }

  deleteFriendship(id: string) {
    this.friendshipService.deleteFriendship(id).subscribe(() => {
      this.onChange()
      }
    )

  }
}
