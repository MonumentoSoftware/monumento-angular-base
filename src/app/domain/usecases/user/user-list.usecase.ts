import { Injectable } from "@angular/core";
import { UserRepository } from "src/app/data/repositories/user.repository";
import { DEFAULT_QUERY } from "src/app/shared/const";
import { Decoder } from "../../base/decoder";
import { IndexUseCase } from "../../base/index.usecase";
import { BaseQuery } from "../../base/query";
import { UserModel } from "../../models/user.model";


@Injectable()
export class UserListUsecase extends IndexUseCase<UserModel, BaseQuery> {
  constructor(repository: UserRepository) {
    super({
      initialQuery: { ...DEFAULT_QUERY },
      decoder: UserModel.decoder as Decoder<UserModel>,
      repository,
    });
  }
}
