import { Injectable } from '@angular/core';
import { RoleRepository } from '@app/data/repositories/role.repository';
import { ToastService } from '@app/shared/services/toast.service';
import { Success } from '@app/shared/util/types/task';
import { PermissionChangeEntity } from '@app/data/entities/permission-change.entity';
import { RoleModel } from '@app/domain/models/role.model';
import { Permission } from '@app/data/entities/permission.enum';

@Injectable()
export class ChangePermissionUsecase {
  private busy = false;
  constructor(protected repository: RoleRepository, protected toastService: ToastService) {}

  async changePermission(role: RoleModel, permission: Permission) {
    const body: PermissionChangeEntity = {
      codename: permission,
      action: role.hasPermission(permission) ? 'remove' : 'add',
    };
    this.busy = true;
    const result = await this.repository.changePermission(role.id, body);

    this.busy = false;
    if (result instanceof Success) {
      return true;
    } else {
      this.toastService.error(result.error.message);
      return false;
    }
  }
}
