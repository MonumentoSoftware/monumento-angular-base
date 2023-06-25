import { Injectable } from '@angular/core';
import { ListWithActionsUsecase } from '@app/domain/base/list-with-actions.usecase';
import { UserFormComponent } from '@app/presentation/user/user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { UserModel } from '../../models/user.model';
import { UserDeleteUsecase } from './user-delete.usecase';
import { UserListUsecase } from './user-list.usecase';
import { UserActivationUseCase } from '@app/domain/usecases/user/user-activation-use-case';
import { BaseQuery } from '@app/domain/base/query';

@Injectable()
export class UserListWithActionsUsecase extends ListWithActionsUsecase<UserModel, BaseQuery> {
  modalFormComponentBuilder(instance?: UserModel) {
    return this.modalController.create({
      component: UserFormComponent,
      componentProps: {
        instance,
      },
    });
  }

  constructor(
    protected list: UserListUsecase,
    protected destroy: UserDeleteUsecase,
    protected activation: UserActivationUseCase,
    protected modalController: ModalController
  ) {
    super();
  }

  async toggleActivation(instance: UserModel) {
    const result = await this.activation.toggleActivation(instance);
    if (result.isSuccess) {
      await this.list.fetch();
    }
  }
}
