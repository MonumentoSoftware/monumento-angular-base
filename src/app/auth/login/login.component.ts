import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [LoginService],
})
export class LoginComponent {
  form = new UntypedFormGroup({
    email: new UntypedFormControl('admin@monumento-software.com'),
    password: new UntypedFormControl('test@123'),
  });

  constructor(public readonly service: LoginService) {}

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
