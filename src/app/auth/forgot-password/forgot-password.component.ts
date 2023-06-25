import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordComponent {
  form = new UntypedFormGroup({
    email: new UntypedFormControl(''),
  });

  constructor(public readonly service: ForgotPasswordService) {}

  get email() {
    return this.form.get('email');
  }
}
