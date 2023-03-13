import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { ApiService} from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-two-factor',
  templateUrl: './edit-two-factor.component.html',
  styleUrls: ['./edit-two-factor.component.css']
})
export class EditTwoFactorComponent implements OnInit, AfterViewInit {

  user: any;
  twoFactorActivated: boolean = false;
  twoFactorSecret: string;
  input_error: string;
  public code: string = '';
  
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
      this.twoFactorActivated = this.user.twofactor;
    });
  }

  ngAfterViewInit() {
    // if(!this.twoFactorActivated)
    // {
    //   console.log('user when generateTwoFactor');
    //   console.log(user);
    //   this.generateTwoFactor();
    // }
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
        this.user.twofactor_secret = this.twoFactorSecret;
        console.log('Two factor secret key: ', this.twoFactorSecret);
        const qrDiv = document.getElementById('QR');
        const img = document.createElement('img');
        img.src = 'http://crazy-pong.com:3000/qrcode';
        qrDiv.appendChild(img);
      },
      (error) => {
        console.error('Error generating two factor secret key: ', error);
      }
    );
  }

  verifyTwoFactor() {
    // Check if the code is empty or not 6 characters
    if (!this.code || this.code.length !== 6) {
      this.input_error = 'Code must be 6 digits';
      return;
    }
    // Check if the code only contains digits
    if (!/^\d+$/.test(this.code)) {
      this.input_error = 'Code must only contain digits';
      return;
    }

    this.apiService.verify2faCode(this.user, this.code).subscribe(
      (response) => {
        if (response) {
          console.log('Two factor authentication successful');
          this.router.navigate(['/profile']);
        } else {
          this.input_error = 'Invalid code, try it again';
          console.log('Two factor authentication failed');
        }
      },
      (error) => {
        console.error('Error verifying two factor authentication: ', error);
      }
    );
  }
}