import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { PasswordDefinitionComponent } from './password-definition/password-definition.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  exports: [],
  declarations: [LoginComponent, ForgotPasswordComponent, PasswordDefinitionComponent],
  providers: [],
})
export class AuthModule { }
