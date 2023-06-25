import {Injectable} from '@angular/core';
import {AppError, NotAcceptableError} from '../util/errors/error';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorsService {
  constructor(private toastService: ToastService) {}

  async showErrors(appError: AppError, fallbackMessage?: string) {
    if (appError instanceof NotAcceptableError) {
      if (appError.items.detail) {
        await this.toastService.error(appError.items.detail);
      } else if (appError.items.non_field_errors) {
        for (const message of appError.items.non_field_errors) {
          await this.toastService.error(message);
        }
      }
    } else {
      await this.toastService.error(fallbackMessage || appError.message);
    }
  }
}
