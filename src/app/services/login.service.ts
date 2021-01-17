import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {SocialUser} from "angularx-social-login";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {Auth} from "../models/auth";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  googleLoginCallBack(userData: SocialUser): Observable<any> {
    return this.http.post("http://localhost:8081/api/callback",
      {userData})
  }
  classicLogin(authObj: string): Observable<any> {
    return this.http.post("http://localhost:8081/api/sessions",authObj)
  }

  updateUser(bodyObj: string): Observable<any>{
    return this.http.put("http://localhost:8081/api/users?type=status&email="+this.currentUserValue.email, bodyObj)
  }
  silentLogout(){
    this.updateUser('{"online":false}').subscribe()
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null);
  }
  logout() {
    // TODO: Handle error subscribe
    this.updateUser('{"online":false}').subscribe()
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}


