import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private socket: CustomSocket, private router: Router) {     
    this.socket.fromEvent('matchmakingPair').subscribe(message => {
      console.log('Matchmaking pair:', message);
      this.router.navigate(['/game/match', message]);
      // Do something with the message
    });
  }

  joinMatchMaking() {
    this.socket.emit('joinMatchMaking');
    return this.socket.fromEvent('joinMatchMaking');
  }
}
