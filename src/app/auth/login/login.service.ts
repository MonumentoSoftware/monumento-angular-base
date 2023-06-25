import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ServerErrorsService } from 'src/app/shared/services/server-errors.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AuthService } from '../api/auth.service';
import { Task } from 'src/app/shared/util/types/task';
import { RootUrlBuilder } from 'src/app/root/root-url-builder';
import { AppError } from 'src/app/shared/util/errors/error';
@Injectable()
export class LoginService {
  public loginTask!: Task;

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private serverErrorsService: ServerErrorsService
  ) { }

  async login(form: any) {
    const spinner = await this.spinnerService.showSpinner();
    this.loginTask = await this.authService.login(form) as Task;

    if (this.loginTask.isSuccess) {
      await this.router.navigate([RootUrlBuilder.home()], { replaceUrl: true });
    } else {
      await this.serverErrorsService.showErrors(this.loginTask.error as AppError);
    }

    await spinner.dismiss();
  }
}
