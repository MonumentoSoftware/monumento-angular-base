import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private loadingController: LoadingController) {}

  async showSpinner() {
    const spinner = await this.loadingController.create({
      message: 'Aguarde...',
      translucent: true,
    });
    await spinner.present();
    return spinner;
  }
}
