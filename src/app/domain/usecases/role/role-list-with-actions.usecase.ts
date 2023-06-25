import { Injectable } from '@angular/core';
import { ListWithActionsUsecase } from '@app/domain/base/list-with-actions.usecase';
import { RoleFormComponent } from '@app/presentation/role/role-form/role-form.component';
import { ModalController } from '@ionic/angular';
import { RoleModel } from '../../models/role.model';
import { RoleDeleteUsecase } from './role-delete.usecase';
import { RoleListUsecase } from './role-list.usecase';
import { BaseQuery } from '@app/domain/base/query';
import { ChangePermissionUsecase } from '@app/domain/usecases/role/change-permission.usecase';
import { Permission } from '@app/data/entities/permission.enum';

@Injectable()
export class RoleListWithActionsUsecase extends ListWithActionsUsecase<RoleModel, BaseQuery> {
  modalFormComponentBuilder(instance?: RoleModel) {
    return this.modalController.create({
      component: RoleFormComponent,
      componentProps: {
        instance,
      },
    });
  }

  constructor(
    protected list: RoleListUsecase,
    protected destroy: RoleDeleteUsecase,
    protected modalController: ModalController,
    protected changePermissionUseCase: ChangePermissionUsecase
  ) {
    super();
  }

  async changePermission(role: RoleModel, permission: Permission) {
    await this.changePermissionUseCase.changePermission(role, permission);
  }
}
