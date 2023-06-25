import { Permission, parsePermission } from 'src/app/data/entities/permission.enum';
import { RoleEntity } from 'src/app/data/entities/role.entity';
import { BaseModel } from './model';

export class RoleModel extends BaseModel<RoleEntity> {
  public readonly permissions: Permission[];
  private name: string;

  constructor(entity: Partial<RoleEntity>) {
    super(entity);

    this.name = entity.name as string;
    this.permissions = entity.permissions?.map((p) => parsePermission(p)) as Permission[];
  }

  static decoder(entity: RoleEntity): RoleModel {
    return new RoleModel(entity);
  }

  hasPermission(permission: Permission) {
    return this.permissions.find((p) => p === permission) != null;
  }
}
