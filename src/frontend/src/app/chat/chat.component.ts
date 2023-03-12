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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, AfterViewInit {
  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  selectedRoom = null;
  public user: any;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.user = this.authService.getLoggedUser();
    this.chatService.emitPaginateRooms(10, 0);
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
}

