import { Injectable } from '@angular/core';
import { DeleteUsecase } from '@app/domain/base/delete.usecase';
import { UserModel } from '../../models/user.model';
import { UserRepository } from '@app/data/repositories/user.repository';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@app/shared/services/toast.service';

@Injectable()
export class UserDeleteUsecase extends DeleteUsecase<UserModel> {
  message = (instance: UserModel) =>
    `Esta função irá excluir permanentimente o ${instance.name}. Tem certeza que deseja excluir o usuário?`;
  title = (_) => `Atenção!`;

  constructor(
    protected repository: UserRepository,
    protected modalController: ModalController,
    protected toastService: ToastService
  ) {
    super();
  }
}
