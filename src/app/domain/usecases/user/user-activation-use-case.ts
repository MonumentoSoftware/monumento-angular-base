import { Injectable } from '@angular/core';
import { UserModel } from '@app/domain/models/user.model';
import { ActivationUsecase } from '@app/domain/base/activation.usecase';
import { UserRepository } from '@app/data/repositories/user.repository';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@app/shared/services/toast.service';

@Injectable()
export class UserActivationUseCase extends ActivationUsecase<UserModel> {
  protected decoder = UserModel.decoder;

  message = (instance) =>
    `Esta função irá bloquear o acesso do ${instance.name} .
    Você pode reverter esta ação futuramente. Tem certeza que deseja bloquear o usuário?`;
  activationSuccessMessage = (instance) => `Usuário ${instance.name} ativado`;
  disableSuccessMessage = (instance) => `Usuário ${instance.name} desativado`;

  constructor(
    protected repository: UserRepository,
    protected modalController: ModalController,
    protected toastService: ToastService
  ) {
    super();
  }
}
