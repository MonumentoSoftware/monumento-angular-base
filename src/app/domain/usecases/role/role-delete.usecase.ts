import { Injectable } from '@angular/core';
import { DeleteUsecase } from '@app/domain/base/delete.usecase';
import { RoleModel } from '../../models/role.model';
import { RoleRepository } from '@app/data/repositories/role.repository';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@app/shared/services/toast.service';

@Injectable()
export class RoleDeleteUsecase extends DeleteUsecase<RoleModel> {
  message = (instance: RoleModel) => `Deseja deletar o grupo ${instance.name}?`;
  title = (_) => `Atenção!`;

  constructor(
    protected repository: RoleRepository,
    protected modalController: ModalController,
    protected toastService: ToastService
  ) {
    super();
  }
}
