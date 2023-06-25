import { Permission } from 'src/app/data/entities/permission.enum';
import { RoleEntity } from 'src/app/data/entities/role.entity';
import { UserType } from 'src/app/data/entities/user-type.enum';
import { UserEntity } from 'src/app/data/entities/user.entity';
import { BaseModel } from './model';
import { Status, parseStatus } from './status.model';

export type GeneralDict = { [key: string]: true }
export class UserModel extends BaseModel<UserEntity> {
  public readonly name!: string;
  public readonly type?: UserType;
  public readonly picture?: string;
  public readonly email: string;
  public readonly document: string;
  public readonly gender: string;
  public readonly cellphone: string;
  public readonly isStaff: boolean;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;

  constructor(entity: Partial<UserEntity>) {
    super(entity);

    this.name = entity.name as string;
    this.document = entity.name as string;
    this.gender = entity.name as string;
    this.cellphone = entity.name as string;
    this.picture = entity.picture as string;
    this.email = entity.email as string;
    this.isStaff = entity.is_staff as boolean;
    this.isActive = entity.is_active as boolean;
    this.type = entity.type as UserType;
    this.createdAt = new Date(entity.created_at as string);
  }

  static decoder(entity: UserEntity): UserModel {
    return new UserModel(entity);
  }



  parsePermissions(roles: RoleEntity[]) {
    const permissions: GeneralDict = {};
    roles?.forEach((role) => {
      role.permissions?.forEach((perm: string) => {
        permissions[perm] = true;
      });
    });
    return permissions;
  }


}
