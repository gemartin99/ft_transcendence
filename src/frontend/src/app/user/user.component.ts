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

  displayedColumns  :  string[] = ['id', 'name', 'password', 'avatar', 'twofactor', 'score', 'played', 'wins', 'losses'];
  searchSource  = [];
  dataSource  = [];
  user = {};
  checkoutForm;
  searchTerm: string;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      password: '',
      avatar: '',
      twofactor: '',
      score: '',
      played: '',
      wins: '',
      losses: ''
    });
    this.searchTerm = '';
  }

  ngOnInit() {
    this.apiService.getFriends().subscribe((result)=>{   
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

  searchUsers() {
    if (this.searchTerm) {
      this.apiService.findUserByname(this.searchTerm).subscribe((result) => {
        console.log(result);
        this.searchSource = result;
      });
    }
  }

  addFriend(user) {
    if (user) {
      this.apiService.addFriend(user.id).subscribe((result)=>{   
        console.log(result); 
      })
    }
  }

  getFriends() {
      this.apiService.getFriends().subscribe((result)=>{   
        console.log(result); 
        this.dataSource  =  result;
      })
  }

  removeFriend(id: number) {
      this.apiService.removeFriend(id).subscribe((result)=>{   
        console.log(result); 
        this.getFriends();
      })
  }

}