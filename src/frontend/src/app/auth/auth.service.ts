import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from  '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;

  constructor(private httpClient: HttpClient) {
  }

  API_SERVER = "http://crazy-pong.com:3000";

  isAuthenticated() {
    return this.httpClient.get('/auth/isAuthenticated');
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
}
