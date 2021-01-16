import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {RegistrationService} from "../../services/registration.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  isLinear = false;
  formGroup: FormGroup;
  usernameCtrl = new FormControl('');
  termsChecked = false;
  response = {}
  private formData: any;
  showSuccessAlert = false
  successAlertText = "You've been successfully registered."
  showDangerAlert = false
  dangerAlertText = "An error occured while registering."
  constructor(private formBuilder: FormBuilder, private regService: RegistrationService) {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEX)])],
      password: ['', Validators.compose([Validators.required,Validators.pattern(this.PASSWORD_REGEX)])],
      passwordConfirmed: ['', Validators.compose([Validators.required,Validators.pattern(this.PASSWORD_REGEX)])],
      termsAgreed: ['', Validators.required]
    },{validator: this.passwordMatchValidator});
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['passwordConfirmed'].value ? null : { matching: true};
  }
  onSubmit(): void {
    console.log(this.formGroup.value)
    this.regService.registerUser(this.formGroup.value).subscribe(() => {
      this.showSuccessAlert = true;
      this.formGroup.reset();
    }, () => {
      this.showDangerAlert = true;
    });
  }


  onXClick() {
    this.showDangerAlert = false;
    this.showSuccessAlert = false
  }
}
