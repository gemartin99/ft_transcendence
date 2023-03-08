import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

function tokenGetter() {
  return `Bearer ${getCookieValue('crazy-pong')}`;
}

const config: SocketIoConfig = {
  url: 'http://crazy-pong.com:3000', options: {
    extraHeaders: {
      Authorization: tokenGetter()
    }
  }
};

@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket {
  constructor() {
    super(config)
  }
}

function getCookieValue(cookieName: string): string {
  const cookieString = document.cookie;
  const cookieArray = cookieString.split(';');
  for (const cookie of cookieArray) {
    const cookieParts = cookie.split('=');
    const name = cookieParts[0].trim();
    if (name === cookieName) {
      console.log('Desde angular getCookieValue:' + cookieParts[1]);
      return cookieParts[1];
    }
  }
  return '';
}