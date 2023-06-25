import { PersonEntity } from '@app/data/entities/person-entity';
import { BaseModel } from './model';
import { Status, parseStatus } from './status.model';

export class PersonModel extends BaseModel<PersonEntity> {
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly status: Status;
  public isActive: boolean;

  constructor(entity: Partial<PersonEntity>) {
    super(entity);

    this.createdAt = new Date(entity.created_at);

    this.status = parseStatus(entity.status);
    this.isActive = this.status === Status.ACTIVE;
    this.name = entity.name;
  }

  static decoder(entity: PersonEntity): PersonModel {
    return new PersonModel(entity);
  }
}
