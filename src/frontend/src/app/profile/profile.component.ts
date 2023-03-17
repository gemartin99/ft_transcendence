import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any;
  public userMatches: any;
  public userRank: any;

  constructor(private authService: AuthService, private apiService: ApiService) { }

  // async ngOnInit() {
  //   this.authService.loadLoggedUser().then(async () => {
  //     this.user = await this.authService.getLoggedUser();
  //     console.log('This is the user data from profile onInit:' + this.user);
  //     console.log('User name: ', this.user.name);
  //     console.log('User played: ', this.user.played);
  //   });
  //   this.apiService.getUserMatches(this.user.id).subscribe(matches => {
  //     this.userMatches = matches;
  //   });
  // }
  async ngOnInit() {
    await this.authService.loadLoggedUser();
    this.user = await this.authService.getLoggedUser();
    console.log('This is the user data from profile onInit:' + this.user);
    console.log('User name: ', this.user.name);
    console.log('User played: ', this.user.played);

    this.apiService.getUserMatches(this.user.id).subscribe(matches => {
      this.userMatches = matches;
    });
    this.apiService.getUserRank(this.user.id).subscribe(rank => {
      this.userRank = rank;
    });
    this.user = await this.authService.refreshLoggedUser();
  }

  //test
}
