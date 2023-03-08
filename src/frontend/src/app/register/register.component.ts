import { Component, OnInit } from '@angular/core';
//import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: any;
  usernameControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9]+$/),
    Validators.maxLength(30)
  ]);

  checkoutForm;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router)
  {
    this.checkoutForm = this.formBuilder.group({
      name: ''
    })

  }

  ngOnInit() {
      this.user = this.authService.getLoggedUser();
  }


  completeRegister(f:any) {
    if(this.user.reg_completed)
      this.router.navigate(['/chat']);
    if (this.usernameControl.valid) {
        this.apiService.registerUser(this.usernameControl.value).subscribe((result)=>{
          console.log(result);
          this.router.navigate(['/chat']);
        });
    }
  }
}