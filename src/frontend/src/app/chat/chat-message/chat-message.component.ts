import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from '../message/message.interface';
import { UserI } from '../../user/user.interface';
import { User } from '../../user';
import { AuthService } from '../..//auth/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  public user: any = {};
  @Input() message: MessageI;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
//    this.authService.loadLoggedUser().then(() => {
      this.user = await this.authService.getLoggedUser();
  //  });
  }
}