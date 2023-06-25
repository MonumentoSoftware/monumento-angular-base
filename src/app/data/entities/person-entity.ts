import { HasId } from '../base/has-id';

export interface PersonEntity extends HasId {
  name: string;
  created_at: string;
  status: string;
}
