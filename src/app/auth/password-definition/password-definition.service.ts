import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { ServerErrorsService } from 'src/app/shared/services/server-errors.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Task } from 'src/app/shared/util/types/task';
import { AuthService } from '../api/auth.service';
import { AppError } from 'src/app/shared/util/errors/error';

@Injectable()
export class PasswordDefinitionService {
  public firstPasswordTask: Task = Task.idle();

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private toastService: ToastService,
    private serverErrorService: ServerErrorsService
  ) {}

  async submit(newPassword: string, uid: string, token: string) {
    const spinner = await this.spinnerService.showSpinner();
    this.firstPasswordTask = await this.authService.changePassword(newPassword, uid, token);

    if (this.firstPasswordTask.isSuccess) {
      await this.toastService.success('Senha definida com sucesso.');
      await this.router.navigate(['/auth/login']);
    } else {
      await this.serverErrorService.showErrors(
        this.firstPasswordTask.error as AppError,
        'Não foi possível definir a senha, tente novamente.'
      );
    }

    await spinner.dismiss();
  }
}
