import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: ''
})
export class LoginComponent {
  constructor() {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0a3a4869eb0242ff32bdffe102dc9021ccbba3501e7da809f76c877b404a84ba&redirect_uri=http%3A%2F%2Fcrazy-pong.com%2Fschool42%2Fcallback&response_type=code';
  }
}