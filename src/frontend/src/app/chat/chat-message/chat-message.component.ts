import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from '../message/message.interface';
import { UserI } from '../../user/user.interface';
import { User } from '../../user';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatUseroptionsComponent } from '../chat-useroptions/chat-useroptions.component';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  public user: any = {};
  @Input() message: MessageI;

  constructor(private authService: AuthService,
              private dialog: MatDialog) { }

  async ngOnInit() {
//    this.authService.loadLoggedUser().then(() => {
      this.user = await this.authService.getLoggedUser();
  //  });
  }

  openModal(num: number) {
    const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    if (overlayContainer) {
      overlayContainer.style.display = 'flex';
    }

    const dialogRef = this.dialog.open(ChatUseroptionsComponent, {
      data: { numParam: num }
    });

    dialogRef.backdropClick().subscribe(() => {
      if (overlayContainer) {
        console.log(`hidding overlay!!!`);
        overlayContainer.style.display = 'none';
      }
    });
  }
}