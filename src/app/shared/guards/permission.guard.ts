import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, skipWhile, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/api/auth.service';
import { UserModel } from 'src/app/domain/models/user.model';
import { RootUrlBuilder } from 'src/app/root/root-url-builder';
import { NoAuthGuard } from './no-auth.guard';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.user$.pipe(
      skipWhile((user:any) => user == null),
      map((user: UserModel) => {
        return user.hasAnyPermission(route.data['permissions']);
      }),
      tap((x) => {
        if (!x) this.router.navigate([RootUrlBuilder.home()]);
      })
    );
  }
}

export const PermissionGuardFunction: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(PermissionGuard).canActivate(route, state);
