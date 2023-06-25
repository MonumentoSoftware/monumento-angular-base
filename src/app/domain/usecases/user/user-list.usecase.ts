import { Injectable } from '@angular/core';
import { UserRepository } from '@app/data/repositories/user.repository';
import { IndexUseCase } from '@app/domain/base/index.usecase';
import { DEFAULT_QUERY } from '@app/shared/const';
import { BaseQuery } from '@app/domain/base/query';
import { UserModel } from '@app/domain/models/user.model';

@Injectable()
export class UserListUsecase extends IndexUseCase<UserModel, BaseQuery> {
  constructor(repository: UserRepository) {
    super({
      initialQuery: { ...DEFAULT_QUERY },
      decoder: UserModel.decoder,
      repository,
    });
  }
}
