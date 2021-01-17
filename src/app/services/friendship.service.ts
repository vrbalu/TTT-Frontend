import { Injectable } from '@angular/core';
import {SocialUser} from "angularx-social-login";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FriendshipCreate} from "../models/friendshipCreate";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) { }

  createFriendship(user1: string, user2: string): Observable<any> {
    let friendshipObj: FriendshipCreate = {user1,user2}
    return this.http.post("http://localhost:8081/api/friendships", friendshipObj)
  }
}
