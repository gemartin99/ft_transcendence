import { Component, OnInit } from '@angular/core';
import { AuthService} from '../auth/auth.service';
import { ApiService} from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit {
  twoFactorSecret: string;
  user: any;
  public code: string = '';
  public input_error: string = '';

  constructor(private authService: AuthService, private apiService: ApiService,  private router: Router) { }

  ngOnInit() {
    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
    });
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
          this.router.navigate(['/chat']);
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
