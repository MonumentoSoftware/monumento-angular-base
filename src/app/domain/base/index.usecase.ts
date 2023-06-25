import { Inject, Injectable } from '@angular/core';
import { BaseQuery } from './query';
import { Decoder } from './decoder';
import { Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, shareReplay } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { BaseRepository } from 'src/app/data/base/base-repository';
import { HasId } from 'src/app/data/base/has-id';
import { Index } from 'src/app/data/base/index-data';
import { DEFAULT_ORDER, OrderOption } from 'src/app/shared/const';
import { Failure } from 'src/app/shared/util/types/task';
import { BaseModel } from '../models/model';
import { Task } from 'src/app/shared/util/types/task';

export enum IndexStrategy {
  prependResult,
  appendResults,
  default,
}

export interface IndexState<Entity extends HasId = HasId, Query extends BaseQuery = BaseQuery> {
  query: Query;
  data: Entity[];
  isBusy: boolean;
}

// implements ObservableUseCase < IndexState < Entity, Query >, IndexAction >
@Injectable()
export abstract class IndexUseCase<Model extends BaseModel = BaseModel, Query extends BaseQuery = BaseQuery>
  implements OnDestroy {
  protected readonly repository: BaseRepository<HasId, Query>;
  protected readonly decoder: Decoder<Model>;
  protected readonly initialQuery: Partial<Query>;
  private typeaheadSubscription: Subscription = new Subscription();
  private dataSubject: Subject<Model[]>;
  typeahead: Subject<string>;
  data$: Observable<Model[]>;

  query: Partial<Query> | any;
  data!: Model[];
  count: number;
  busy: boolean;
  isSuccess: boolean;
  private result!: Task<Index<Model>> | null;

  constructor(
    @Inject(null)
    args: {
      initialQuery: Partial<Query>;
      decoder: Decoder<Model>;
      repository: BaseRepository<HasId, Query>;
    }
  ) {
    this.initialQuery = args.initialQuery;
    this.query = args.initialQuery;
    this.count = 0;
    this.busy = true;
    this.isSuccess = false;
    this.result = null;

    this.decoder = args.decoder;
    this.repository = args.repository;

    this.typeahead = new Subject();
    this.typeaheadSubscription = this.typeahead
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((v) => this.search(v));

    this.dataSubject = new BehaviorSubject([] as Model[]);
    this.data$ = this.dataSubject.pipe(shareReplay());

    this.setData([]);
  }

  async updateQuery(
    query: Partial<Query> | any,
    indexStrategy: IndexStrategy = IndexStrategy.default
  ): Promise<Task<Index<Model>> | null> {
    if (query == null) return Promise.resolve(this.result) as Promise<Task<Index<Model>>>;

    let nothingNew = true;
    Object.keys(query).forEach((key: any) => {
      if (this.query[key] !== query[key]) nothingNew = false;
    });
    if (nothingNew) return Promise.resolve(this.result) as Promise<Task<Index<Model>>>;

    this.query = { ...this.query, ...query };
    return await this.fetch(indexStrategy);
  }

  async goToPage(page: number, indexStrategy: IndexStrategy = IndexStrategy.default): Promise<Task<Index<Model>> | null> {
    if (this.query.page === page) return await Promise.resolve(this.result) as unknown as Promise<Task<Index<Model>>>;
    return await this.updateQuery({ page } as Query, indexStrategy);
  }

  async accumulateNextPage(): Promise<Task<Index<Model>> | null> {
    if (typeof this.query.page !== 'number' || this.query.page < 0) return await Promise.resolve(this.result) as unknown as Promise<Task<Index<Model>>>;
    return await this.goToPage(this.query.page + 1, IndexStrategy.appendResults);
  }

  async sort(columnName: string): Promise<Task<Index<Model>> | null> {
    const query = {} as Query;
    if (this.query.sort === columnName) {
      if (this.query.order !== 'asc' && this.query.order !== 'desc') {
        query.order = DEFAULT_ORDER;
      } else {
        query.order = this.query.order === 'asc' ? 'desc' : 'asc';
      }
    } else {
      query.sort = columnName;
    }
    return await this.updateQuery(query);
  }

  async search(value: string): Promise<Task<Index<Model>> | null> {
    if (this.query.search != null && this.query.search === value) return await Promise.resolve(this.result) as unknown as Promise<Task<Index<Model>>>;
    return await this.updateQuery({ search: value, page: this.initialQuery.page } as Query);
  }

  updateById(model: Model): Model[] {
    if (typeof model.id !== 'number') return this.data;
    const index = this.data.findIndex((el) => el.id === model.id);
    this.setData([...this.data.slice(0, index), model, ...this.data.slice(index + 1, this.data.length)]);
    return this.data;
  }

  async fetch(indexStrategy: IndexStrategy = IndexStrategy.default): Promise<Task<Index<Model>> | null> {
    this.busy = true;

    this.result = await this.repository.index(this.query, this.decoder);

    this.busy = false;
    this.isSuccess = this.result?.isSuccess as boolean;
    if (this.result instanceof Failure) {
      if (indexStrategy === IndexStrategy.default) {
        this.setData([]);
      }
      this.count = 0;
    } else {
      if (indexStrategy === IndexStrategy.appendResults) {
        this.setData([...this.data, ...this.result?.data?.results as Model[]]);
      } else if (indexStrategy === IndexStrategy.prependResult) {
        this.setData([...this.result?.data?.results as Model[], ...this.data]);
      } else {
        this.setData(this.result?.data?.results as Model[]);
      }
      this.count = this.result?.data?.count || this.data.length;
    }
    return this.result;
  }

  trackBy(instance: Model): number | null {
    if (instance == null) return null;
    return instance.id;
  }

  private setData(data: Model[]) {
    this.data = data;
    this.dataSubject.next(data as Model[]);
  }

  ngOnDestroy() {
    this.typeaheadSubscription?.unsubscribe();
  }
}
