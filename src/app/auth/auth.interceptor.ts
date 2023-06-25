import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';
import { AuthService } from './api/auth.service';
import { AuthUrlBuilder } from './auth-url-builder';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.token;

    if (token) {
      const headers = request.headers.set('Authorization', `Bearer ${token}`);
      request = request.clone({ headers });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (this.authService.user && err.status) {
          if (err.status === 401) {
            this.toastService.error('Credenciais Inválidas.');
            this.logout();
          } else if (err.status === 403) {
            this.toastService.error('Acesso negado.');
          }
        }
        return throwError(err) as Observable<any>;
      })
    );
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate([AuthUrlBuilder.login()], { replaceUrl: true });
  }
}
