import { Component, OnInit } from '@angular/core';
//import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Get the current headers of the request
    // this.headers = new HttpHeaders();
    // console.log('Request headers:', this.headers);
    this.authService.loadLoggedUser().then(() => {
      this.user = this.authService.getLoggedUser();
    });
  }
}