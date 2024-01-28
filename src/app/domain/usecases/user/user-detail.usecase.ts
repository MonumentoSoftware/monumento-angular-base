import { Injectable } from "@angular/core";
import { UserRepository } from "src/app/data/repositories/user.repository";
import { Decoder } from "../../base/decoder";
import { DetailUsecase } from "../../base/detail.usecase";
import { UserModel } from "../../models/user.model";


@Injectable()
export class UserDetailUsecase extends DetailUsecase<UserModel> {
  protected decoder = UserModel.decoder as Decoder<UserModel>;

  constructor(protected repository: UserRepository) {
    super();
  }
}
