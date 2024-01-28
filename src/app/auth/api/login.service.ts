import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { ServerErrorsService } from 'src/app/shared/services/server-errors.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AuthService } from './auth.service';
import { Task } from 'src/app/shared/util/types/task';
import { RootUrlBuilder } from 'src/app/root/root-url-builder';
import { AppError } from 'src/app/shared/util/errors/error';

/**
 * The login form
 * @property email - the user email
 * @property password - the user password
 */
export interface LoginForm {
  email: string;
  password: string;
}

/**
 * This service is responsible for handling the login process.
 */
@Injectable()
export class LoginService {
  /**
   * This task is used to track the login process.
   */
  public loginTask!: Task;
  /**
   * This property is used to store the error messages.
   */
  public errorMessages!: string;

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private serverErrorsService: ServerErrorsService,
    private modalcontroller: ModalController,
  ) {}

  /**
   * This method is used to login the user.
   * @param form
   */
  async login(form: {}) {
    const spinner = await this.spinnerService.showSpinner();
    this.loginTask = (await this.authService.login(form as LoginForm)) as Task;
    if (this.loginTask.isSuccess) {
      await this.router.navigate([RootUrlBuilder.home()], { replaceUrl: true });
    } else {
      await this.serverErrorsService.showErrors(
        this.loginTask.error as AppError,
      );
    }
    await spinner.dismiss();
  }

  /**
   * This method is used to register or login the user with google.
   * @param token The google token
   */
  async continueWithGoogle(token: string, isModal: boolean = true) {
    const spinner = await this.spinnerService.showSpinner();
    // We need to decode the token to get the user login form
    // So, we register the user with google information res and then login the user with the same token
    const register = await this.authService.signupWithGoogle(token);
    if (register.isSuccess) {
      this.loginTask = await this.authService.loginWithGoogle(
        register.data?.auth_token as string,
      );
      if (this.loginTask.isSuccess) {
        await this.router.navigate(['portal'], {
          replaceUrl: true,
        });
        if (isModal) {
          this.modalcontroller.dismiss();
        }
      } else {
        this.errorMessages = this.loginTask.error?.items;
        await this.serverErrorsService.showErrors(
          this.loginTask.error as AppError,
        );
      }
    }

    await spinner.dismiss();
  }
}
