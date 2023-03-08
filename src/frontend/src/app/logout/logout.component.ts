import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

   constructor(private apiService: ApiService, private authService: AuthService, private router: Router) { }

   ngOnInit() {
      this.onLogout();
   }

  async   onLogout() {

      const res = await this.authService.logout();
      this.router.navigate(['']);
  }
}