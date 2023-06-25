import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RoleRepository } from '@app/data/repositories/role.repository';
import { ToastService } from '@app/shared/services/toast.service';
import { FormUseCase } from '../../base/form.usecase';
import { RoleModel } from '../../models/role.model';

@Injectable()
export class RoleFormUsecase extends FormUseCase<RoleModel> {
  protected readonly decoder = RoleModel.decoder;

  protected async buildForm(model: RoleModel) {
    return this.fb.group({
      name: this.fb.control(model?.entity?.name, [Validators.required, Validators.minLength(3)]),
    });
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  constructor(
    protected readonly repository: RoleRepository,
    protected toastService: ToastService,
    private fb: FormBuilder
  ) {
    super();
  }
}
