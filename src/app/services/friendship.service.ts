import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FriendshipCreate} from '../models/friendshipCreate';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) {
  }

  createFriendship(user1: string, user2: string): Observable<any> {
    const friendshipObj: FriendshipCreate = {user1, user2};
    return this.http.post('http://localhost:8081/api/friendships', friendshipObj);
  }

  getFriendships(user: string, isPending: string, forRequest: string): Observable<any> {
    if (forRequest === '') {
      return this.http.get('http://localhost:8081/api/friendships?user=' + user + '&isPending=' + isPending);
    } else {
      return this.http.get('http://localhost:8081/api/friendships?user=' + user + '&isPending=' + isPending + '&forRequest=' + forRequest);

    }
  }

  deleteFriendship(id: string): Observable<any> {
    return this.http.delete('http://localhost:8081/api/friendships/' + id);
  }

  updateFriendshipStatus(id: string, isPending: string): Observable<any> {
    return this.http.put('http://localhost:8081/api/friendships/' + id + '?isPending=' + isPending, {});
  }
}
