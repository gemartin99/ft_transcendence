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
  public archivements: number[];
  public isfriend: boolean = false;
  public isblocked: boolean = false; 

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
    this.apiService.getArchivements(parseInt(id)).subscribe((response) => {
      this.archivements = response;
      console.log('archivements:');
      console.log(this.archivements);
    });

    this.apiService.getRelationByUserId(parseInt(id)).subscribe((response) => {
      console.log('getRelationByUserId');
      console.log(response);
      if (response) {
        this.isfriend = response.is_friend;
        this.isblocked = response.is_blocked;
        console.log('isfriend: ' + response.is_friend);
        console.log('isblocked: ' + response.is_friend);
      }
    });


    console.log(this.profile_user);
  }

  addFriend(id)
  {
    this.isfriend = true;
  }

  blockUser(id)
  {
    this.isblocked = true;
  }

  removeFriend(id)
  {
    this.isfriend = false;
  }

  unblockUser(id)
  {
    this.isblocked = false;
  }
}