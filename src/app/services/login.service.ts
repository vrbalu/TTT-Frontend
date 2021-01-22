import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SocialUser} from 'angularx-social-login';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  googleLoginCallBack(userData: SocialUser): Observable<any> {
    return this.http.post('http://localhost:8081/api/callback',
      {userData});
  }

  classicLogin(authObj: string): Observable<any> {
    return this.http.post('http://localhost:8081/api/sessions', authObj);
  }

  logout(): void {
    // TODO: Handle error subscribe
    this.userService.updateUser({username: this.currentUserValue.username, online: false, inGame: false}).subscribe();
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}


