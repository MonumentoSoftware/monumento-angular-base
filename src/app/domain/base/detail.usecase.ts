import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { BaseModel } from '../models/model';
import { Decoder } from './decoder';
import { AppError } from 'src/app/shared/util/errors/error';
import { BaseRepository } from 'src/app/data/base/base-repository';
import { HasId } from 'src/app/data/base/has-id';

export abstract class DetailResult<T> {
  public abstract readonly isCreation: boolean;
  public abstract readonly isSuccess: boolean;
  public abstract readonly data: T | null;
  public abstract readonly error: AppError | null;
}

export class DetailNotAsked<T> extends DetailResult<T> {
  isCreation = false;
  isSuccess = false;
  data = null;
  error = null;
  constructor() {
    super()
  }
}

export class DetailError<T> extends DetailResult<T> {
  isCreation = false;
  isSuccess = false;
  data = null;
  constructor(public readonly error: AppError) {
    super();
  }
}

export class DetailCreation<T> extends DetailResult<T> {
  isCreation = true;
  isSuccess = true;
  data = null;
  error = null;
}

export class DetailData<T> extends DetailResult<T> {
  isCreation = false;
  isSuccess = true;
  error = null;
  constructor(public readonly data: T) {
    super();
  }
}

export abstract class DetailUsecase<Model extends BaseModel<Entity>, Entity extends HasId = HasId> {
  protected busySubject: BehaviorSubject<boolean>;
  busy$: Observable<boolean>;

  protected resultSubject!: BehaviorSubject<DetailResult<Model>>;
  public result$: Observable<DetailResult<Model>>;

  protected abstract repository: BaseRepository<Entity>;
  protected abstract decoder: Decoder<Model, Entity>;

  constructor() {
    this.busySubject = new BehaviorSubject(true);
    this.busy$ = this.busySubject.pipe(shareReplay());
    this.resultSubject = new BehaviorSubject(new DetailNotAsked<Model>()) as unknown as BehaviorSubject<DetailResult<Model>>;
    this.result$ = this.resultSubject.pipe(shareReplay());
  }

  async fetch(id: number): Promise<DetailResult<Model>> {
    let result;
    if (id == null) {
      result = new DetailCreation();
    } else {
      this.busySubject.next(true);
      const response = await this.repository.show(id, this.decoder as Decoder<Model>);
      if (response.isSuccess) result = new DetailData(response.data);
      else result = new DetailError(response?.error as AppError);
    }
    this.busySubject.next(false);
    this.resultSubject.next(result);
    return result;
  }
}
