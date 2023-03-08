import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from  './user';
import { Observable } from 'rxjs';
import { UserI } from  './user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user: any;

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

  public registerUser(name: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    console.log("api registerUSer whit name: " + name);
    const body = JSON.stringify({ name });
    console.log("bpdy antes de mandar:" + body);
    return this.httpClient.post<any>(`${this.API_SERVER}/users/register`, body, httpOptions);
  }

  public findUserByname(name: string): Observable<UserI[]> {
    return this.httpClient.get<UserI[]>(`${this.API_SERVER}/users/find-by-username?name=${name}`, { withCredentials: true });
  }

  public addFriend(userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.API_SERVER}/users/friends`, { friendId: userId }, { withCredentials: true });
  }

  public getFriends(){
    return this.httpClient.get<User[]>(`${this.API_SERVER}/users/friends`, { withCredentials: true });
  }

  public removeFriend(friendId: number) {
    return this.httpClient.delete(`${this.API_SERVER}/users/friends/${friendId}/delete`, { withCredentials: true });
  }

  public uploadAvatar(avatar: FormData): Observable<any> {
    return this.httpClient.post(`${this.API_SERVER}/avatar/upload`, avatar);
  }

  public updateTwofactor(twofactor: boolean) {
    return this.httpClient.put<User>(`${this.API_SERVER}/users/twofactor`, { twofactor }, { withCredentials: true });
  }
}