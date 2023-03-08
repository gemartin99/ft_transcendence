import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
      console.log('This is the user data from profile onInit:' + this.user);
      console.log('User name: ', this.user.name);
      console.log('User played: ', this.user.played);
    });
  }
}
