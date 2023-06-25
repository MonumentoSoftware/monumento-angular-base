import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ListWithActionsUsecase } from '@app/domain/base/list-with-actions.usecase';

@Component({
  selector: 'app-modal-container',
  template: '',
})
export class ModalContainerComponent implements OnDestroy {
  private modal: HTMLIonModalElement;
  constructor(modalController: ModalController, route: ActivatedRoute, router: Router, list: ListWithActionsUsecase) {
    modalController
      .create({
        component: route.snapshot.data.modal,
        componentProps: {
          route,
          list,
        },
      })
      .then((modal) => {
        this.modal = modal;
        this.modal.onWillDismiss().then((value) => router.navigate([route.parent.snapshot.url]));
        this.modal.present();
      });
  }
  ngOnDestroy(): void {
    this.modal.dismiss();
  }
}
