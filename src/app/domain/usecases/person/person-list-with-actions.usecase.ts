import { Injectable } from '@angular/core';
import { ListWithActionsUsecase } from '@app/domain/base/list-with-actions.usecase';
import { PersonQuery } from '@app/domain/models/person-query';
import { ModalController } from '@ionic/angular';
import { PersonModel } from '../../models/person.model';
import { PersonDeleteUsecase } from './person-delete.usecase';
import { PersonListUsecase } from './person-list.usecase';
import { PersonActivationUseCase } from '@app/domain/usecases/person/person-activation-use-case';

@Injectable()
export class PersonListWithActionsUsecase extends ListWithActionsUsecase<PersonModel, PersonQuery> {
  get possibleStatus() {
    return this.list.possibleStatus;
  }

  constructor(
    protected list: PersonListUsecase,
    protected destroy: PersonDeleteUsecase,
    protected activation: PersonActivationUseCase,
    protected modalController: ModalController
  ) {
    super();
  }

  changeStatus(_) {
    return this.list.changeStatus(_);
  }

  async toggleActivation(instance: PersonModel) {
    const result = await this.activation.toggleActivation(instance);
    if (result.isSuccess) {
      await this.list.fetch();
    }
  }
}
