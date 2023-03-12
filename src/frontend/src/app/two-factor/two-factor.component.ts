import { Component, OnInit } from '@angular/core';
import { AuthService} from '../auth/auth.service';
import { ApiService} from '../api.service';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit {
  twoFactorSecret: string;
  user: any;

  constructor(private authService: AuthService, private apiService: ApiService) { }

  ngOnInit() {
    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
    });
  }

  // generateTwoFactor() {
  //   this.apiService.get2faSecretKey(this.user).subscribe((response: string) => {
  //     this.twoFactorSecret = response;
  //   });
  // }
  generateTwoFactor() {
    this.apiService.get2faSecretKey(this.user).subscribe(
      (response: string) => {
        this.twoFactorSecret = response;
        console.log('Two factor secret key: ', this.twoFactorSecret);
      },
      (error) => {
        console.error('Error generating two factor secret key: ', error);
      }
    );
  }

}
