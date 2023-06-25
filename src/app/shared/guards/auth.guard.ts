import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, skipWhile, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/api/auth.service';
import { Unauthenticated, Authenticated, AuthState } from 'src/app/auth/api/auth.state';
import { AuthUrlBuilder } from 'src/app/auth/auth-url-builder';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.state$.pipe(
      skipWhile((s: any) => s?.resolved),
      tap((s:any) => {
        if (s instanceof Unauthenticated) {
          this.router.navigate([AuthUrlBuilder.root()], { queryParams: { returnUrl: state.url }, replaceUrl: true });
        }
      }),
      map((s) => s instanceof Authenticated)
    );
  }
}

export const AuthGuardFunction: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(route, state);
