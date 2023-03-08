import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';


@Component({
  selector: 'app-chat-useroptions',
  templateUrl: './chat-useroptions.component.html',
  styleUrls: ['./chat-useroptions.component.css']
})
export class ChatUseroptionsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router,
              private dialogRef: MatDialogRef<ChatUseroptionsComponent>,
              private chatService: ChatService) {}

  ngOnInit() {
  }

  viewProfile(id: number)
  {
    this.router.navigate(['/profiles', id]);
    this.dialogRef.close();
  }

  sendPrivMSg(id: number)
  {
    this.chatService.sendPrivMSg(id);
    this.dialogRef.close();
  }

  muteUser(id: number)
  {
    this.chatService.muteUser(id);
    this.dialogRef.close();
  }

  inviteToGame(id: number)
  {
    this.chatService.inviteToGame(id);
    this.dialogRef.close();
  }
}