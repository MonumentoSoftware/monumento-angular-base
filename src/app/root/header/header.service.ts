import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUrlBuilder } from 'src/app/auth/auth-url-builder';

@Injectable()
export class HeaderService {
  constructor(private router: Router, ) {}

  async logout() {
    //await this.authService.logout();
    await this.router.navigate([AuthUrlBuilder.login()], { replaceUrl: true });
  }
}
