import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './auth.interceptor';
import { NoAuthGuard } from '../shared/guards/no-auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordDefinitionComponent } from './password-definition/password-definition.component';

const authRoutes: Routes = [
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'esqueceuSenha',
        component: ForgotPasswordComponent,
      },
      {
        path: 'redefinicaoSenha',
        component: PasswordDefinitionComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
  ],
})
export class AuthRoutingModule {}
