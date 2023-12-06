import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {UserRole} from "../models/user-role.enum";
import {Result} from "../models/result.model";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationClient {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<Result> {
    return this.http.post<Result>(
      environment.backendUrl + '/api/v1/auth/signin',
      {
        email: email,
        password: password,
      },
    );
  }

  public register(
    firstname: string,
    lastname: string,
    role: UserRole,
    email: string,
    password: string
  ): Observable<Result> {
    return this.http.post<Result>(
      environment.backendUrl + '/api/v1/auth/signup',
      {
        firstname: firstname,
        lastname: lastname,
        role: role,
        email: email,
        password: password,
      },
    );
  }

  public logout(): Observable<string> {
    return this.http.post<string>(environment.backendUrl + '/api/v1/auth/logout', { responseType: 'text' });
  }
}
