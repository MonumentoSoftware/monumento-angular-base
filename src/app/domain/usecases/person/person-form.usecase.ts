import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { PersonRepository } from '@app/data/repositories/person-repository.service';
import { ToastService } from '@app/shared/services/toast.service';
import { FormUseCase } from '../../base/form.usecase';
import { PersonModel } from '../../models/person.model';

@Injectable()
export class PersonFormUsecase extends FormUseCase<PersonModel> {
  protected readonly decoder = PersonModel.decoder;

  protected async buildForm(model: PersonModel) {
    return this.fb.group({
      name: this.fb.control(model?.entity?.name, [Validators.required, Validators.minLength(3)]),
    });
  }

  get name() {
    return this.form.get('name') as UntypedFormControl;
  }

  constructor(
    protected readonly repository: PersonRepository,
    protected toastService: ToastService,
    private fb: UntypedFormBuilder
  ) {
    super();
  }
}
