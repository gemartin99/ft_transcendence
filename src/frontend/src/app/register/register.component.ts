import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  headers: HttpHeaders;

  constructor() { }

  ngOnInit() {
    // Get the current headers of the request
    this.headers = new HttpHeaders();
    console.log('Request headers:', this.headers);
  }
}