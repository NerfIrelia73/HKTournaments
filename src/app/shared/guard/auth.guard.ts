import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationEnd } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in'])
    }
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url == '/admin-panel') {
        this.authService.usersInfo.forEach((info) => {
          if (info != null && (info.siteAdmin == null || !info.siteAdmin)) {
            this.router.navigate([''])
          }
        })
      }
    });
    return true;
  }
}