import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }
  getUsers(OnlineOnly: boolean): Observable<any>{
    return this.http.get("http://localhost:8081/api/users?online="+OnlineOnly)
  }

  changePassword(email: string, body: any): Observable<any> {
    return this.http.put("http://localhost:8081/api/users?type=password&email="+email,body)
  }
}
