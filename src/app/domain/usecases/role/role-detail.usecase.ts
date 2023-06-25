import { Injectable } from '@angular/core';
import { RoleRepository } from '@app/data/repositories/role.repository';
import { DetailUsecase } from '@app/domain/base/detail.usecase';
import { RoleModel } from '../../models/role.model';

@Injectable()
export class RoleDetailUsecase extends DetailUsecase<RoleModel> {
  protected decoder = RoleModel.decoder;

  constructor(protected repository: RoleRepository) {
    super();
  }
}
