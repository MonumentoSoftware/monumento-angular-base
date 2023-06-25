import { ModalController } from '@ionic/angular';
import { BaseRepository } from 'src/app/data/base/base-repository';
import { HasId } from 'src/app/data/base/has-id';
import { ModalChoiceComponent } from 'src/app/shared/components/modals/modal-choice/modal-choice.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Success } from 'src/app/shared/util/types/task';

export abstract class DeleteUsecase<Model extends HasId> {
  busy = false;
  protected abstract repository: BaseRepository;
  protected abstract modalController: ModalController;
  protected abstract toastService: ToastService;
  protected abstract message: (instance: Model) => string;
  protected abstract title: (instance: Model) => string;
  protected abstract subtitle: (instance: Model) => string ;
  protected abstract cancelLabel: (instance: Model) => string ;
  protected abstract confirmLabel: (instance: Model) => string ;

  async askAndDelete(instance: Model): Promise<boolean> {
    const modal = await this.modalController.create({
      component: ModalChoiceComponent,
      componentProps: {
        header: this.title(instance) || 'Excluir',
        subHeader: this.subtitle(instance),
        message: this.message(instance),
        cancelLabel: this.cancelLabel(instance),
        confirmLabel: this.confirmLabel(instance),
        severity: 'danger',
      },
      cssClass: 'modal-sm',
    });

    modal.present();
    const {
      data: { answer },
    } = await modal.onDidDismiss();

    if (answer === true) {
      this.busy = true;
      const result = await this.repository.delete(instance.id);

      this.busy = false;
      if (result instanceof Success) {
        return true;
      } else {
        this.toastService.error(result?.error?.message as string);
        return false;
      }
    } else {
      return false;
    }
  }
}
