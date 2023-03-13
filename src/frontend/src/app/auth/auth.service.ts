import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from  '../user';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  public logout$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  API_SERVER = "http://crazy-pong.com:3000";

  isAuthenticated() {
    //return this.httpClient.get('/auth/isAuthenticated');
    return this.httpClient.get<any>(`${this.API_SERVER}/auth`, { withCredentials: true }).toPromise();
  }

  async loadLoggedUser(){
      if (!this.user) {
          try {
            this.user = await this.httpClient.get<User>(`${this.API_SERVER}/auth/user`, { withCredentials: true }).toPromise();
            //this.user = await this.httpClient.get<User>(`${this.API_SERVER}/auth/user`, { withCredentials: true }).toPromise();
          } catch (error) {
            console.error(error);
          }
      }
  }

  async getLoggedUser() {
      if (!this.user) {
        await this.loadLoggedUser();
      }
      console.log('This is the user data from auth service:' + this.user);
      return this.user;
  }

  async logout(): Promise<number>{
    document.cookie = "crazy-pong=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log('auth service the frontend logout()');
    const response = await this.httpClient.get<any>(`${this.API_SERVER}/auth/logout`, { withCredentials: true }).toPromise();
    this.user = null;
    console.log('response logout' + response);
    this.logout$.next();
    return 1;
  }
}
