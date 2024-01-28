import { ModalController } from "@ionic/angular";
import { BaseRepository } from "src/app/data/base/base-repository";
import { HasId } from "src/app/data/base/has-id";
import { UserEntity } from "src/app/data/entities/user.entity";
import { ModalChoiceComponent } from "src/app/shared/components/modals/modal-choice/modal-choice.component";
import { ToastService } from "src/app/shared/services/toast.service";
import { Success } from "src/app/shared/util/types/task";
import { BaseModel } from "../models/model";
import { Status } from "../models/status.model";
import { Decoder } from "./decoder";
import { Task } from "src/app/shared/util/types/task";
abstract class Activable {
  isActive!: boolean;
}

export abstract class ActivationUsecase<Model extends BaseModel & Activable> {
  protected abstract readonly decoder: Decoder<Model>;
  protected abstract repository: BaseRepository<UserEntity>;
  protected abstract modalController: ModalController;
  protected abstract toastService: ToastService;

  busy = false;
  message!: (instance: Model) => string;
  activationSuccessMessage!: (instance: Model) => string;
  disableSuccessMessage!: (instance: Model) => string;

  async toggleActivation(instance: Model): Promise<Task<Model | undefined | any>> {
    if (instance.isActive) {
      return await this.askAndDisable(instance);
    } else {
      return await this.activate(instance);
    }
  }

  async askAndDisable(instance: Model): Promise<Task<Model | null>> {
    const modal = await this.modalController.create({
      component: ModalChoiceComponent,
      componentProps: {
        header: 'Desabilitar',
        message: this.message(instance),
        severity: 'warning',
      },
      cssClass: 'modal-sm',
    });

    modal.present();
    const {
      data: { answer },
    } = await modal.onDidDismiss();

    if (answer === true) {
      this.busy = true;
      const result = await this.submitDisableRequest(instance);

      this.busy = false;
      if (result instanceof Success) {
        this.toastService.success(this.disableSuccessMessage(instance));
        return result;
      } else {
        this.toastService.error(result?.error?.message as string);
        return result;
      }
    } else {
      return null as any;
    }
  }

  private async activate(instance: Model): Promise<Task<Model>> {
    const result = await this.submitActivationRequest(instance);

    this.busy = false;
    if (result instanceof Success) {
      this.toastService.success(this.activationSuccessMessage(instance));
      return result;
    } else {
      this.toastService.error(result?.error?.message as string);
      return result;
    }
  }

  protected async submitDisableRequest(instance: Model) {
    return await this.repository.save({ id: instance.id, status: Status.DISABLED } as HasId, this.decoder);
  }

  protected async submitActivationRequest(instance: Model) {
    return await this.repository.save({ id: instance.id, status: Status.ACTIVE } as HasId, this.decoder);
  }
}
