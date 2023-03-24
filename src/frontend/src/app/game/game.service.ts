import { Injectable, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatchComponent } from './match/match.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService implements AfterViewInit{
  @ViewChild(MatchComponent) matchComponent: MatchComponent;
  private gameStateEmitter = new EventEmitter<any>();



  constructor(private socket: CustomSocket, private router: Router, private httpClient: HttpClient) {     
    this.socket.fromEvent('matchmakingPair').subscribe(message => {
      console.log('Matchmaking pair:', message);
      this.router.navigate(['/game/match', message]);
      // Do something with the message
    });
    this.socket.fromEvent('gameState').subscribe(message => {
      // /this.matchComponent.redrawCanvas(message);
      //this.matchComponent.gameState = message;
      //console.log('gameState:', message);
      this.gameStateEmitter.emit(message);
    });
  }

  get gameState(): EventEmitter<any> {
    return this.gameStateEmitter;
  }

  ngAfterViewInit() {

  }

  joinMatchMaking() {
    this.socket.emit('joinMatchMaking');
    return this.socket.fromEvent('joinMatchMaking');
  }

  leaveMatchMaking() {
    this.socket.emit('leaveMatchMaking');
    //return this.socket.fromEvent('leaveMatchMaking');
  }

  playerInput(data: number[]){

    const input = { input: data };
    console.log('Emiting player input to server');
    this.socket.emit("playerInput", input);
  }

  joinClientToMatch(matchId: number)
  {
    this.socket.emit("joinClientToMatch", matchId);
  }

  getGameColorOption(): Observable<string> {
    return this.getGameOption().pipe(
      map((result) => {
        if (result == 0) return 'black';
        if (result == 1) return 'green';
        if (result == 2) return 'brown';
        if (result == 3) return 'blue';
        return 'black';
      })
    );
  }

  API_SERVER = "http://crazy-pong.com:3000";

  public getGameOption(): Observable<number> {
    return this.httpClient.get<number>(`${this.API_SERVER}/users/game/options`, { withCredentials: true });
  }
}
