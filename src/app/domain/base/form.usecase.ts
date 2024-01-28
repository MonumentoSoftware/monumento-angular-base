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

export abstract class FormUseCase<
  Model extends BaseModel,
  SaveArgs extends HasId = HasId,
> {
  /**
   * @description Repository that will be used to save the form.
   */
  protected abstract readonly repository: BaseRepository<
    HasId,
    BaseQuery,
    SaveArgs
  >;
  /**
   * @description Decoder that will be used to decode the response from the server.
   */
  protected abstract readonly decoder: Decoder<Model>;
  /**
   * @description Service that will be used to show toast messages.
   */
  protected abstract readonly toastService: ToastService;
  /**
   * @description Builds the form that will be used to edit the model.
   */
  protected abstract buildForm(model: Model | null): Promise<UntypedFormGroup>;

  /**
   * @description Model that is being edited. If null, it means that the form is in creation mode.
   */
  protected editModel!: Model | null;
  /**
   * @description Form that is being edited.
   */
  public form!: UntypedFormGroup;
  /**
   * @description Indicates if the form is being edited.
   */
  public busy: boolean;
  /**
   * @description Indicates if the form is ready to be edited.
   */
  public isReady: boolean;
  /**
   * @description Indicates if the form was successfully submitted.
   */
  public isSuccess: boolean;
  /**
   * @description Indicates if the form is in creation mode.
   */
  public isCreation = true;
  /**
   * @description Indicates if the form has errors.
   */
  public hasFormErrors: boolean;
  /**
   * @description Error that occurred when submitting the form.
   */
  public error: AppError | null;
  /**
   * @description Error messages that occurred when submitting the form.
   */
  public errorMessages: any;

  constructor() {
    this.busy = false;
    this.isReady = false;
    this.isSuccess = false;
    this.hasFormErrors = false;
    this.error = null;
    this.errorMessages = {};
  }

  /**
   * This method must be called before using the form.
   * It initializes the form and returns the model that is being edited.
   * If the model is null, it means that the form is in creation mode.
   */
  async init(model: Model | null): Promise<Model | null> {
    this.isReady = false;
    this.editModel = model;
    if (model) {
      this.isCreation = false;
    }
    this.form = await this.buildForm(model as Model);
    this.isReady = true;
    return model;
  }

  /**
   * General method to submit the form.
   * It gets the arguments that will be sent to the server and submits the request.
   */
  async submit(): Promise<Task<Model> | null> {
    if (this.form.dirty) {
      this.busy = true;
      const args = await this.prepareFormToSubmit(
        this.editModel as Model,
        this.form,
      );
      const result = await this.submitRequest(args);
      this.busy = false;
      return result;
    }
    return null;
  }

  /**
   * Prepares the form to be submitted, returning the arguments that will be sent to the server.
   * If an edit model exists, the id of the model is added to the arguments.
   * @param editModel
   * @param form
   * @returns
   */
  protected prepareFormToSubmit(
    editModel: Model,
    form: UntypedFormGroup,
  ): Promise<SaveArgs> {
    const value = form.value;
    if (editModel != null) value.id = editModel.id;
    return value;
  }

  /**
   * Submits the request to the server.
   *
   * @param args The arguments that will be sent to the server.
   */
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

  /**
   * Displays a toast message when an error occurs.
   * @param error
   */
  protected async submitErrorSideEffect(error: AppError): Promise<void> {
    if (error instanceof NotAcceptableError) {
      console.log('scroll para o topo ou para o primeiro capmo com erros');
      return;
    } else {
      await this.toastService.error(error.message);
      return;
    }
  }

  /**
   * Returns the server errors for the given field.
   * @param field
   * @returns
   */
  serverErrorsFor(field: string): string[] {
    if (this.error instanceof AppError) return this.error.errorsFor(field);
    return [];
  }
}
