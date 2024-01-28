import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/shared/validators/must-match.validator';
import { PasswordDefinitionService } from './password-definition.service';

@Component({
  selector: 'app-first-password',
  templateUrl: './password-definition.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [PasswordDefinitionService],
})
export class PasswordDefinitionComponent {
  form = new FormGroup(
    {
      new_password1: this.fb.control('', [Validators.required]),
      new_password2: this.fb.control('', [Validators.required]),
    },
    {validators: [MustMatch('new_password1', 'new_password2') as ValidatorFn]}
  );
  readonly uid: string;
  readonly token: string;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder, public readonly service: PasswordDefinitionService) {
    this.uid = route.snapshot.queryParams['uid'];
    this.token = route.snapshot.queryParams['uid'];
  }

  get new_password1() {
    return this.form.get('new_password1');
  }

  get new_password2() {
    return this.form.get('new_password2');
  }
}
