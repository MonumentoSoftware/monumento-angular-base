import { Permission } from "./permission.enum";

export interface PermissionChangeEntity {
  codename: Permission;
  action: 'add' | 'remove';
}
