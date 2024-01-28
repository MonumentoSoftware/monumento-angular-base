import { Injectable } from "@angular/core";
import { ToastService } from "src/app/shared/services/toast.service";
import { Decoder } from "../../base/decoder";
import { UserModel } from "../../models/user.model";
import { UserRepository } from "src/app/data/repositories/user.repository";

@Injectable()
export class UserFavoritesUsecase {
  protected decoder = UserModel.decoder as Decoder<UserModel>;

  constructor(
    protected repository: UserRepository,
    protected toastService: ToastService,
  ) {}
}
