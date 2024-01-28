import { UserEntity } from "src/app/data/entities/user.entity";
import { BaseModel } from "./model";

export class UserModel extends BaseModel<UserEntity> {
  public readonly name!: string;
  public readonly picture: string | null;
  public readonly email: string;
  public readonly isActive: boolean;
  public readonly isStaff: boolean;

  constructor(entity: Partial<UserEntity>) {
    super(entity);

    this.name = entity.name as string;
    this.email = entity.email as string;
    this.picture = entity.picture as string | null;
    this.isActive = entity.is_active!;
    this.isStaff = entity.is_staff!;
  }

  static decoder(entity: UserEntity): UserModel {
    return new UserModel(entity);
  }
}
