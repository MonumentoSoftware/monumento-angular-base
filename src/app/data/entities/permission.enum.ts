export enum Permission {
  CAN_MODIFY_USER = 'can_modify_user',
  CAN_MODIFY_ADMINISTRATIVE = 'can_modify_administrative',
  CAN_MODIFY_CAR = 'can_modify_car',
  UNKNOWN = 'UNKNOWN',
}

export function parsePermission(s: string): Permission {
  switch (s) {
    case Permission.CAN_MODIFY_USER:
      return Permission.CAN_MODIFY_USER;
    case Permission.CAN_MODIFY_ADMINISTRATIVE:
      return Permission.CAN_MODIFY_ADMINISTRATIVE;
    case Permission.CAN_MODIFY_CAR:
      return Permission.CAN_MODIFY_CAR;
    default:
      return Permission.UNKNOWN;
  }
}
