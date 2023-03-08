import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns  :  string[] = ['id', 'name', 'title', 'email', 'phone', 'address', 'city', 'actions'];
  dataSource  = [];
  user = {};
  checkoutForm;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    })
  }

  ngOnInit() {
    this.apiService.readUsers().subscribe((result)=>{   
      console.log(result); 
      this.dataSource  =  result;
    })
  }

  selectUser(user){
    this.user = user;
    console.log("selected: ", this.user);
  }

  newUser(){
    console.log("Pressed new user");
    this.user = {};
  }

  createUser(f:any){

    console.log("form value: ", f);

    this.apiService.createUser(f).subscribe((result)=>{
      console.log(result);
    });
    
  }

  deleteUser(id){
    this.apiService.deleteUser(id).subscribe((result)=>{
      console.log(result);
    });
  }

  updateUser(f){
    console.log("Update", f.value)
    f.value.id = this.user['id'];
    this.apiService.updateUser(f.value).subscribe((result)=>{
      console.log(result);
    });
  }

}