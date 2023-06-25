import { HasId } from "src/app/data/base/has-id";

export abstract class BaseModel<Entity extends HasId = HasId> implements HasId {
  get id(): number {
    return this.entity.id as number;
  }
  public readonly entity: Partial<Entity>;

  constructor(entity: Partial<Entity>) {
    this.entity = entity;
  }
}
