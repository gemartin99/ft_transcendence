import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: ''
})
export class LoginComponent {
  constructor() {
    window.location.href = 'http://crazy-pong.com:3000/auth/school42';
  }
}