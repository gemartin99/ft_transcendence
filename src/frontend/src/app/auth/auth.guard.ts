import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  //constructor(private router: Router, private jwtService: JwtHelperService, private authService: AuthService) { }
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      console.log('authGuard no identificado!!!!!');
      return false;
    }
    console.log('authGuard identificado CORRECTAMENTE!!!!!');
    return true;
  }
}