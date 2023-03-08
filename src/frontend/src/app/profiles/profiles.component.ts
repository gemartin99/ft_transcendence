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
  //public user: any;

  constructor(private authService: AuthService, private apiService: ApiService, private route: ActivatedRoute) { }

  async ngOnInit() {
    // this.authService.loadLoggedUser().then(async () => {
    //   this.user = await this.authService.getLoggedUser();
    // });
    // const id = this.route.snapshot.paramMap.get('id');
    // console.log('Profile User ID from route parameter:', id);
    // this.apiService.findUserById(parseInt(id)).then(async () => {
    //   this.profile_user = await this.apiService.findUserById(parseInt(id));
    // });
    //this.user = await this.authService.loadLoggedUser();
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Profile User ID from route parameter:', id);
    this.profile_user = await this.apiService.findUserByname('Marc');
    console.log(this.profile_user);
  }
}