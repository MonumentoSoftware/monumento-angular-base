import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { skipWhile, tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/api/auth.service';
import { Authenticated, Unauthenticated } from 'src/app/auth/api/auth.state';
import { AuthGuard } from './auth.guard';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard {
  constructor(private router: Router, private readonly authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.state$.pipe(
      skipWhile((s: any) => !s.resolved),
      tap((s) => {
        if (s instanceof Authenticated) {
          this.router.navigate(['/home'], { replaceUrl: true });
        }
      }),
      map((s) => s instanceof Unauthenticated)
    );
  }
}

export const NoAuthGuardFunction: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(NoAuthGuard).canActivate(route, state);
