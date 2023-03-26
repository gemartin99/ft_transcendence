import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-chat-useroptions',
  templateUrl: './chat-useroptions.component.html',
  styleUrls: ['./chat-useroptions.component.css']
})
export class ChatUseroptionsComponent implements OnInit {

  isblocked = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router,
              private dialogRef: MatDialogRef<ChatUseroptionsComponent>,
              private chatService: ChatService,
              private apiService: ApiService) {}

  async ngOnInit() {
    const num = this.data.numParam;
    this.apiService.getRelationByUserId(parseInt(num)).subscribe((response) => {
      console.log('getRelationByUserId');
      console.log(response);
      if (response) {
        this.isblocked = response.is_blocked;
        console.log('isblocked: ' + response.is_friend);
      }
    });
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
    this.apiService.blockUser(id).subscribe((result)=>{
      console.log('call to muteUser');
    });
    this.dialogRef.close();
  }

  unmuteUser(id: number)
  {
    this.apiService.unblockUser(id).subscribe((result)=>{
      console.log('call to unmuteUser');
    });
    this.dialogRef.close();
  }

  inviteToGame(id: number)
  {
    this.chatService.inviteToGame(id);
    this.dialogRef.close();
  }
}