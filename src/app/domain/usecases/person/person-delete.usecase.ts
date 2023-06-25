import { Injectable } from '@angular/core';
import { DeleteUsecase } from '@app/domain/base/delete.usecase';
import { PersonModel } from '../../models/person.model';
import { PersonRepository } from '@app/data/repositories/person-repository.service';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@app/shared/services/toast.service';

@Injectable()
export class PersonDeleteUsecase extends DeleteUsecase<PersonModel> {
  message = (instance: PersonModel) => `Deseja deletar a pessoa ${instance.name}?`;
  title = (_) => `Atenção!`;

  constructor(
    protected repository: PersonRepository,
    protected modalController: ModalController,
    protected toastService: ToastService
  ) {
    super();
  }
}
