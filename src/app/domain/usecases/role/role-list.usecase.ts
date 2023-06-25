import { Injectable } from '@angular/core';
import { RoleModel } from '../../models/role.model';
import { RoleRepository } from 'src/app/data/repositories/role.repository';
import { DEFAULT_QUERY } from 'src/app/shared/const';
import { IndexUseCase } from '../../base/index.usecase';
import { BaseQuery } from '../../base/query';
import { Decoder } from '../../base/decoder';

@Injectable({
  providedIn: 'root',
})
export class RoleListUsecase extends IndexUseCase<RoleModel, BaseQuery> {
  constructor(repository: RoleRepository) {
    super({
      initialQuery: { ...DEFAULT_QUERY },
      decoder: RoleModel.decoder as Decoder<RoleModel>,
      repository,
    });
  }
}
