import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
//import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { User } from  '../user';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  public user: any;
  private ngUnsubscribe = new Subject();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Get the current headers of the request
    // this.headers = new HttpHeaders();
    // console.log('Request headers:', this.headers);
    this.authService.loadLoggedUser().then(() => {
      this.user = this.authService.getLoggedUser();
    });

    // this.authService.logout.subscribe(() => {
    //   this.user = null;
    // });
    this.authService.logout$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.user = null;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Add the JavaScript code here
      (function() {
        var burger = document.querySelector('.burger');
        var nav = document.querySelector('#navbar-links');

        burger.addEventListener('click', function(){
          burger.classList.toggle('is-active');
          nav.classList.toggle('is-active');
        });
      })();
    }, 100);
  }
}