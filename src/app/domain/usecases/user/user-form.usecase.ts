import { Injectable } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FormUseCase } from '../../base/form.usecase';
import { UserRepository } from 'src/app/data/repositories/user.repository';
import { ToastService } from 'src/app/shared/services/toast.service';
import { NotAcceptableError } from 'src/app/shared/util/errors/error';
import { Failure } from 'src/app/shared/util/types/task';
import { UserModel } from '../../models/user.model';
import { Decoder } from '../../base/decoder';
import { Task } from 'src/app/shared/util/types/task';

@Injectable()
export class UserFormUsecase extends FormUseCase<UserModel> {
  protected readonly decoder = UserModel.decoder as Decoder<UserModel>;

  roleList = [];
  public selectedType!: number;

  get name(): FormControl<string> {
    return this.form?.get('name') as FormControl<string>;
  }

  get email(): FormControl<string> {
    return this.form?.get('email') as FormControl<string>;
  }

  get type(): FormControl<string> {
    return this.form?.get('type') as FormControl<string>;
  }

  get picture(): FormControl<File> {
    return this.form?.get('picture') as FormControl<File>;
  }

  get gender(): FormControl<string> {
    return this.form?.get('gender') as FormControl<string>;
  }

  get cellphone(): FormControl<string> {
    return this.form?.get('cellphone') as FormControl<string>;
  }

  get document(): FormControl<string> {
    return this.form?.get('document') as FormControl<string>;
  }

  get birthday(): FormControl<string> {
    return this.form?.get('birthday') as FormControl<string>;
  }

  constructor(
    protected readonly repository: UserRepository,
    protected toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
  ) {
    super();
  }

  protected async buildForm(model: UserModel) {
    return this.formBuilder.group({
      name: this.formBuilder.control(model?.entity?.name, [
        Validators.required,
      ]),
      email: this.formBuilder.control(model?.entity?.email, [
        Validators.required,
        Validators.required,
      ]),
      picture: this.formBuilder.control(model?.entity?.picture, []),
    });
  }

  override async submit(): Promise<Task<UserModel> | null> {
    if (this.form.valid) {
      this.busy = true;
      const args = this.prepareFormDataToSubmit(
        this.editModel as UserModel,
        this.form,
      );
      const result = await this.submitFormDataRequest(args);
      this.busy = false;

      return result;
    } else return null;
  }

  private async submitFormDataRequest(
    args: FormData,
  ): Promise<Task<UserModel>> {
    const result = await this.repository.saveFormData(args, this.decoder);
    this.isSuccess = result.isSuccess;
    if (result instanceof Failure) {
      this.error = result.error;
      this.errorMessages = this.error.items;
      this.hasFormErrors = result.error instanceof NotAcceptableError;
      this.submitErrorSideEffect(this.error);
    }
    return result;
  }

  protected prepareFormDataToSubmit(
    editModel: UserModel,
    form: UntypedFormGroup,
  ) {
    const value = form.value;

    const formData = new FormData();
    if (this.name.dirty) formData.append('name', value.name);
    if (this.email.dirty) formData.append('email', value.email);
    if (this.picture.dirty) formData.append('picture', value.picture);
    if (this.type.dirty) formData.append('type', value.type);

    if (editModel) formData.append('id', editModel.id?.toString());
    return formData;
  }
}
