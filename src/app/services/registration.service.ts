import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {}

  registerUser(registrationData: FormData){
    return this.http.post<any>("http://localhost:8081/api/users",registrationData)
  }
}
