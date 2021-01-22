import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {FriendshipCreate} from "../models/friendshipCreate";
import {HttpClient} from "@angular/common/http";
import {UpdateGame} from "../models/updateGame";
import {Stats} from "../models/stats";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  createGame(user1: string, user2: string): Observable<any> {
    let gameObj: FriendshipCreate = {user1,user2}
    return this.http.post("http://localhost:8081/api/games", gameObj);
  }
  updateGame(updateObj: UpdateGame): Observable<any> {
    return this.http.put("http://localhost:8081/api/games", updateObj);
  }
  getGameStats(): Observable<[Stats]> {
    return this.http.get<[Stats]>("http://localhost:8081/api/games/stats");
  }
}
