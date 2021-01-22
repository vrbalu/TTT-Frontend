import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  registerUser(registrationData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8081/api/users', registrationData);
  }
}
