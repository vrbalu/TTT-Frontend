import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {LoginService} from '../../services/login.service';
import {Friendship} from '../../models/friendship';
import {FriendshipService} from '../../services/friendship.service';

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
  successAlertText = 'Password successfully changed.';
  dangerAlertText = 'There was an error changing, please try again.';
  friendsRequestList: Friendship[] = [];
  friendsList: Friendship[] = [];
  currentUser = this.loginService.currentUserValue;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private loginService: LoginService,
              private friendshipService: FriendshipService,
              private friendshipService2: FriendshipService) {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(this.PASSWORD_REGEX)])],
      passwordConfirmed: ['', Validators.compose([Validators.required, Validators.pattern(this.PASSWORD_REGEX)])],
    }, {validator: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.getFriends();
  }

  onChange(): void {
    this.getFriends();
  }

  passwordMatchValidator(frm: FormGroup): any {
    return frm.controls.password.value === frm.controls.passwordConfirmed.value ? null : {matching: true};
  }

  onSubmit(): void {
    this.userService.changePassword(this.currentUser.email, this.formGroup.value).subscribe(() => {
      this.showSuccessAlert = true;
      this.formGroup.reset();
    }, () => {
      this.showDangerAlert = true;
    });
  }

  getFriends(): void {
    this.friendshipService2.getFriendships(this.currentUser.username, 'false', '').subscribe(resp2 => {
      this.friendsList = resp2;
      this.friendshipService.getFriendships(this.currentUser.username, 'true', 'true').subscribe(resp => {
        this.friendsRequestList = resp;
      });
    });
  }

  onXClick(): void {
    this.showDangerAlert = false;
    this.showSuccessAlert = false;
  }

  acceptFriendRequest(id: string): void {
    this.friendshipService.updateFriendshipStatus(id, 'false').subscribe(() => {
      this.onChange();
    });

  }

  deleteFriendship(id: string): void {
    this.friendshipService.deleteFriendship(id).subscribe(() => {
        this.onChange();
      }
    );

  }
}
