import { Component, OnInit } from '@angular/core';
//import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';

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
  constructor(private authService: AuthService, private apiService: ApiService, private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      name: ''
    })

  }

  ngOnInit() {
    //this.authService.loadLoggedUser().then(() => {
      this.user = this.authService.getLoggedUser();
    // });
  }


  completeRegister(f:any) {
    console.log("submit pressed");
    if (this.usernameControl.valid) {
      console.log("form value: ", f);
      console.log("usernamecontrol is valid");
      //this.user = this.apiService.registerUser(this.usernameControl.value);
        this.apiService.registerUser(this.usernameControl.value).subscribe((result)=>{
          console.log(result);
      });

    }
  }
}