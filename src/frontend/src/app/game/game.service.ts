import { Injectable, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';
import { Router } from '@angular/router';
import { MatchComponent } from './match/match.component';

@Injectable({
  providedIn: 'root'
})
export class GameService implements AfterViewInit{
  @ViewChild(MatchComponent) matchComponent: MatchComponent;
  private gameStateEmitter = new EventEmitter<any>();

  constructor(private socket: CustomSocket, private router: Router) {     
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

  playerInput(data: number[]){

    const input = { input: data };
    console.log('Emiting player input to server');
    this.socket.emit("playerInput", input);
  }
}
