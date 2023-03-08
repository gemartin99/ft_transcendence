import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from  './user';
import { Observable } from 'rxjs';
import { UserI } from  './user/user.interface';
import { Match } from  './game/match/match.entity';

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

  public findUserById(userId: number): Observable<User> {
    console.log('Call to API SERVICE findUserById:' + userId);
    return this.httpClient.get<User>(`${this.API_SERVER}/users/finding/${userId}`, { withCredentials: true });
    //return this.httpClient.get<User>(`${this.API_SERVER}/users/find/${id}`, { withCredentials: true });
    //return this.httpClient.get<User>(`${this.API_SERVER}/users/find/${id}`);
  }

  public addFriend(userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.API_SERVER}/users/friends`, { friendId: userId }, { withCredentials: true });
  }

  public getFriends(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.API_SERVER}/users/friends`, { withCredentials: true });
  }

  public removeFriend(id: string) {
    console.log('API front removeFriend');
    return this.httpClient.delete(`${this.API_SERVER}/users/friends/${id}/delete`, { withCredentials: true });
    // return this.httpClient.delete(`${this.API_SERVER}/users/friends/5/delete`);
  }

  public uploadAvatar(avatar: FormData): Observable<any> {
    return this.httpClient.post(`${this.API_SERVER}/avatar/upload`, avatar, { withCredentials: true });
  }

  public updateTwofactor(twofactor: boolean) {
    return this.httpClient.put<User>(`${this.API_SERVER}/users/twofactor`, { twofactor }, { withCredentials: true });
  }

  public getUserMatches(userId: number): Observable<Match[]> {
    return this.httpClient.get<Match[]>(`${this.API_SERVER}/match/user-matches/${userId}`, { withCredentials: true });
  }

  public getUserRank(userId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.API_SERVER}/users/rank/${userId}`, { withCredentials: true });
  }
}