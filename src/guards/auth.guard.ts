import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {

  constructor(private usersService: UsersService, private router: Router){}

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //pozrie sa na dany path
    //ked vrati false => akoby dane pravidlo neexistovalo v tom routri
    console.log("Match guarding url "+ route.path);
    return this.canAnything(route.path || '')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("guarding url "+ state.url);
      return this.canAnything(state.url)
  }

  canAnything(url:string){
    return this.usersService.isLoggedInAsync().pipe(
      tap(ok => {
        if (!ok) {
          this.usersService.navigateAfterLogin = url;
          this.router.navigateByUrl("/login");
        }
      })
    );
  }

}
