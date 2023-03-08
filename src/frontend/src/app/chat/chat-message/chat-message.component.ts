import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from '../message/message.interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: MessageI;

  constructor() { }

  ngOnInit(): void {
  }

}