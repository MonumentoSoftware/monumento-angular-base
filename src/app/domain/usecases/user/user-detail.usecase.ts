import { Injectable } from '@angular/core';
import { UserRepository } from '@app/data/repositories/user.repository';
import { DetailUsecase } from '@app/domain/base/detail.usecase';
import { UserModel } from '../../models/user.model';

@Injectable()
export class UserDetailUsecase extends DetailUsecase<UserModel> {
  protected decoder = UserModel.decoder;

  constructor(protected repository: UserRepository) {
    super();
  }
}
