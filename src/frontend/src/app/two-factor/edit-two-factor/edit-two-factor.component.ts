import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { ApiService} from '../../api.service';

@Component({
  selector: 'app-edit-two-factor',
  templateUrl: './edit-two-factor.component.html',
  styleUrls: ['./edit-two-factor.component.css']
})
export class EditTwoFactorComponent implements OnInit {

  user: any;
  twoFactorActivated: boolean = false;
  twoFactorSecret: string;
  
  constructor(private authService: AuthService, private apiService: ApiService) { }

  ngOnInit() {
    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
      this.twoFactorActivated = this.user.twofactor;
    });
  }

  unsetTwoFactor() {
    console.log('Pressed desactivate two factor');
    this.apiService.disable2fa(this.user).subscribe(
      (response: string) => {
        this.twoFactorActivated = false;
        console.log('desactivate succesfully');
      },
      (error) => {
        console.error('Error unseting: ', error);
      }
    );
  }

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