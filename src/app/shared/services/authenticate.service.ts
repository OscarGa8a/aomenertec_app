import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Credentials, User, ResponseToken } from '../interfaces/users.interface';
import { AuthenticateEndpoint } from '../endpoints/authenticate.endpoint';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private token: string;
  private userLogin: User;

  constructor(private http: HttpClient) { }

  authenticate(credentials: Credentials): Observable<ResponseToken> {
    return this.http.post<ResponseToken>(AuthenticateEndpoint.authenticate, credentials)
                .pipe(
                  tap(response => this.setToken(response.access_token))
                );
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getProfileUser(): Observable<User> {
    const headers = new HttpHeaders({
      authorization: `bearer ${this.getToken()}`
    });
    return this.http.post<User>(AuthenticateEndpoint.profile, {}, {headers})
                .pipe(
                  tap(response => this.setUserLogin(response))
                );
  }

  getUserLogin(): User {
    return this.userLogin;
  }

  setUserLogin(user: User): void {
    this.userLogin = user;
  }

}
