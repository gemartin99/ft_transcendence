import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from './chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomI, RoomPaginateI } from "./rooms/room.interface";
import { UserI } from '../user/user.interface';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { JoinRoomComponent } from './rooms/join-room/join-room.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { CustomSocket } from '../sockets/custom-socket';
import { MatchChallange } from '../game/match/match-challange/match-challange.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatComponent implements OnInit, AfterViewInit {
  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  selectedRoom = null;
  error_string = null;
  matchChallange: MatchChallange = null;
  chat_manual = false;
  public user: any;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private dialog: MatDialog,
    private socket: CustomSocket,
    private readonly router: Router)
  {
    this.socket.fromEvent('matchmakingPair').subscribe(message => {
      console.log('Matchmaking pair:', message);
      this.router.navigate(['/game/match', message]);
      this.matchChallange = null
      // Do something with the message
    }); 
  }

  ngOnInit() {
    this.user = this.authService.getLoggedUser();
    this.chatService.emitPaginateRooms(10, 0);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('You moved out of chat page');
      }
    });
    this.socket.on('gameChallange', (gameChallange: MatchChallange) => {
      this.matchChallange = gameChallange;
      console.log('gameChallange received');
    });
    this.chatService.haveOpenChallange();
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

  openModalCreateRoom() {
    const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    if (overlayContainer) {
      overlayContainer.style.display = 'flex';
    }
    const dialogRef = this.dialog.open(CreateRoomComponent);

    dialogRef.backdropClick().subscribe(() => {
      if (overlayContainer) {
        console.log(`hidding overlay!!!`);
        overlayContainer.style.display = 'none';
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
      if (overlayContainer) {
        console.log(`hidding overlay!!!`);
        overlayContainer.style.display = 'none';
      }
    });
  }

  openModalJoinRoom() {
    const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    if (overlayContainer) {
      overlayContainer.style.display = 'flex';
    }
    const dialogRef = this.dialog.open(JoinRoomComponent);

    dialogRef.backdropClick().subscribe(() => {
      if (overlayContainer) {
        console.log(`hidding overlay!!!`);
        overlayContainer.style.display = 'none';
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
      if (overlayContainer) {
        console.log(`hidding overlay!!!`);
        overlayContainer.style.display = 'none';
      }
    });
  }

  acceptChallange()
  {
    this.matchChallange = null;
    this.chatService.acceptChallange();
  }

  cancelChallange()
  {
    this.matchChallange = null;
    this.chatService.cancelChallange();
  }

  showManual()
  {
    this.chat_manual = true;
  }

  close_manual()
  {
    this.chat_manual = false;
  }
}

