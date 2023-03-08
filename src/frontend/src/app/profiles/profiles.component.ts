import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  public profile_user: any;
  public userMatches: any;
  public userRank: any;
  //public user: any;

  constructor(private authService: AuthService, private apiService: ApiService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Profile User ID from route parameter:', id);
    this.profile_user = await this.apiService.findUserById(parseInt(id));
    await this.apiService.getUserRank(parseInt(id));
    this.apiService.findUserById(parseInt(id)).subscribe(user => {
      this.profile_user = user;
    });
    this.apiService.getUserMatches(parseInt(id)).subscribe(matches => {
      this.userMatches = matches;
    });
    this.apiService.getUserRank(parseInt(id)).subscribe(rank => {
      this.userRank = rank;
    });
    console.log(this.profile_user);
  }
}