import { AbstractControl, ValidationErrors } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): void=> {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return ;
    }

    // set error on matchingControl if validation fails
    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ mustMatch: true });
    } else {
      matchingControl?.setErrors(null);
    }
  };
}
