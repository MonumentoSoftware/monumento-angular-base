import { HasId } from 'src/app/data/base/has-id';
import { BaseModel } from '../models/model';

export type Decoder<Model extends BaseModel<Entity>, Entity extends HasId = HasId> = (entity: Entity) => Model;
