import { UserType } from './user-type.enum';
import { HasId } from '../base/has-id';
import { Status } from 'src/app/domain/models/status.model';
import { RoleEntity } from './role.entity';

export interface UserEntity extends HasId {
  id: number;
  name: string;
  email: string;
  document: string;
  gender: string;
  cellphone?: string;
  is_staff?: boolean;
  is_active?: boolean;
  picture?: string;
  birthday: string;
  type?: string;
  created_at?:string
}


