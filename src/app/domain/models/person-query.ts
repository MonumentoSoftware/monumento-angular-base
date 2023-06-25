import { BaseQuery } from '../base/query';
import { Status } from './status.model';

export interface PersonQuery extends BaseQuery {
  status: Array<Status>;
}
