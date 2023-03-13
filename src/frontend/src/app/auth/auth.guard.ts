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
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
      .then((authenticated: boolean) => {
        if (authenticated) {
          console.log('authGuard identificado CORRECTAMENTE!!!!!');
          return true;
        } else {
          this.router.navigate(['']);
          console.log('authGuard no identificado!!!!!');
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}