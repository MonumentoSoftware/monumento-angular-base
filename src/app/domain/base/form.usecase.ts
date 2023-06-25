import { UntypedFormGroup } from '@angular/forms';
import { BaseModel } from '../models/model';
import { Decoder } from './decoder';
import { BaseQuery } from './query';
import { BaseRepository } from 'src/app/data/base/base-repository';
import { HasId } from 'src/app/data/base/has-id';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppError, NotAcceptableError } from 'src/app/shared/util/errors/error';
import { Failure } from 'src/app/shared/util/types/task';
import { Task } from 'src/app/shared/util/types/task';

export abstract class FormUseCase<Model extends BaseModel, SaveArgs extends HasId = HasId> {
  protected abstract readonly repository: BaseRepository<HasId, BaseQuery, SaveArgs>;
  protected abstract readonly decoder: Decoder<Model>;
  protected abstract readonly toastService: ToastService;

  protected editModel!: Model | null;
  form!: UntypedFormGroup;
  busy: boolean;
  isReady: boolean;
  isSuccess: boolean;
  isCreation = true;
  hasFormErrors: boolean;
  error: AppError | null;
  errorMessages: any;

  protected abstract buildForm(model: Model): Promise<UntypedFormGroup>;

  constructor() {
    this.busy = false;
    this.isReady = false;
    this.isSuccess = false;
    this.hasFormErrors = false;
    this.error = null;
    this.errorMessages = {};
  }

  async init(model: Model | null) {
    this.isReady = false;
    this.editModel = model;
    if (model) this.isCreation = false;
    this.form = await this.buildForm(model as Model);
    this.isReady = true;
    return model;
  }

  async submit(): Promise<Task<Model> | null> {
    if (this.form.dirty) {
      this.busy = true;
      const args = await this.prepareFormToSubmit(this.editModel as Model, this.form);
      const result = await this.submitRequest(args);
      this.busy = false;
      return result;
    }
    return null
  }

  serverErrorsFor(field: string): string[] {
    if (this.error instanceof AppError) return this.error.errorsFor(field);
    return [];
  }

  protected prepareFormToSubmit(editModel: Model, form: UntypedFormGroup): Promise<SaveArgs> {
    const value = form.value;
    if (editModel != null) value.id = editModel.id;
    return value;
  }

  protected async submitErrorSideEffect(error: AppError) {
    if (error instanceof NotAcceptableError) {
      console.log('scroll para o topo ou para o primeiro capmo com erros');
    } else {
      await this.toastService.error(error.message);
    }
  }

  protected async submitRequest(args: SaveArgs): Promise<Task<Model>> {
    const result = await this.repository.save(args, this.decoder);
    this.isSuccess = result.isSuccess;
    if (result instanceof Failure) {
      this.error = result.error;
      this.errorMessages = this.error.items;
      this.hasFormErrors = result.error instanceof NotAcceptableError;
      this.submitErrorSideEffect(this.error);
    }
    return result;
  }
}
