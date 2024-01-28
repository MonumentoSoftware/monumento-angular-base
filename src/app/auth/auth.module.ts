import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { PasswordDefinitionComponent } from './password-definition/password-definition.component';
import { LoginRegisterModalComponent } from './login-register-modal/login-register-modal.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  exports: [],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    PasswordDefinitionComponent,
    LoginRegisterModalComponent,
  ],
  providers: [],
})
export class AuthModule {}
