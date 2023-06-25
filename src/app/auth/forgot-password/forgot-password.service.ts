import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerErrorsService } from 'src/app/shared/services/server-errors.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from '../api/auth.service';
import { Task } from 'src/app/shared/util/types/task';
import { AppError } from 'src/app/shared/util/errors/error';
@Injectable()
export class ForgotPasswordService {
  public recoverPasswordTask!: Task;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private serverErrorsService: ServerErrorsService,
    private toastService: ToastService
  ) { }

  async submit(email: string) {
    const spinner = await this.spinnerService.showSpinner();
    this.recoverPasswordTask = await this.authService.requestPasswordReset<any>(email);

    if (this.recoverPasswordTask.isSuccess) {
      await this.toastService.success('Um email foi enviado com o link de recuperação da senha.');
      await this.router.navigate(['..', 'validacaoToken']);
    } else {
      await this.serverErrorsService.showErrors(this.recoverPasswordTask.error as AppError);
    }

    await spinner.dismiss();
  }
}
