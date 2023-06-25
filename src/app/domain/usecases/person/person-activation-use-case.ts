import { Injectable } from '@angular/core';
import { ActivationUsecase } from '@app/domain/base/activation.usecase';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@app/shared/services/toast.service';
import { PersonModel } from '@app/domain/models/person.model';
import { PersonRepository } from '@app/data/repositories/person-repository.service';

@Injectable()
export class PersonActivationUseCase extends ActivationUsecase<PersonModel> {
  protected decoder = PersonModel.decoder;

  message = (instance) =>
    `Esta função irá deixar a ${instance.name} inacessível para os clientes.
    Você pode reverter esta ação futuramente. Tem certeza que deseja desabilitar pessoa?`;
  activationSuccessMessage = (instance) => `Pessoa ${instance.name} ativada`;
  disableSuccessMessage = (instance) => `Pessoa ${instance.name} desativada`;

  constructor(
    protected repository: PersonRepository,
    protected modalController: ModalController,
    protected toastService: ToastService
  ) {
    super();
  }
}
