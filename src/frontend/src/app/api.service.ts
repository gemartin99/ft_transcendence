import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from  './user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }  

  API_SERVER = "http://crazy-pong.com:3000";

  public readUsers(){
      return this.httpClient.get<User[]>(`${this.API_SERVER}/users`);
    }

    public createUser(user: User){
      return this.httpClient.post<User>(`${this.API_SERVER}/users/create`, user);
    }

    public updateUser(user: User){
      return this.httpClient.put<User>(`${this.API_SERVER}/users/${user.id}/update`, user);
    }

    public deleteUser(id: number){
      return this.httpClient.delete(`${this.API_SERVER}/users/${id}/delete`);
    }
}