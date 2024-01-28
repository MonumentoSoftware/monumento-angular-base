import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../api/login.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [LoginService],
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('admin@monumento-software.com'),
    password: new FormControl('test@123'),
  });

  constructor(public readonly service: LoginService) {}

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
