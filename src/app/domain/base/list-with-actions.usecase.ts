import { ModalController } from '@ionic/angular';
import { DeleteUsecase } from './delete.usecase';
import { IndexUseCase } from './index.usecase';
import { BaseQuery } from './query';
import { BaseModel } from '../models/model';

export abstract class ListWithActionsUsecase<Model extends BaseModel = BaseModel, Query extends BaseQuery = BaseQuery> {
  protected abstract list: IndexUseCase<Model, Query>;
  protected abstract destroy: DeleteUsecase<Model>;
  protected abstract modalController: ModalController;

  get busy() {
    return this.list.busy || this.destroy.busy;
  }
  get query() {
    return this.list.query;
  }
  get isSuccess() {
    return this.list.isSuccess;
  }
  get data() {
    return this.list.data;
  }
  get count() {
    return this.list.count;
  }

  constructor() { }

  search(_:any) {
    return this.list.search(_);
  }
  goToPage(_: any) {
    return this.list.goToPage(_);
  }
  sort(_: any) {
    return this.list.sort(_);
  }
  fetch() {
    return this.list.fetch();
  }
  updateQuery(_: any) {
    return this.list.updateQuery(_);
  }

  async askAndDelete(instance: Model) {
    const result = await this.destroy.askAndDelete(instance);

    if (result === true) {
      await this.list.fetch();
    }
  }
}
