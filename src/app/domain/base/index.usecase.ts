import { Inject, Injectable } from '@angular/core';
import { BaseQuery } from './query';
import { Decoder } from './decoder';
import { Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  shareReplay,
} from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { BaseRepository } from 'src/app/data/base/base-repository';
import { HasId } from 'src/app/data/base/has-id';
import { Index } from 'src/app/data/base/index-data';
import { DEFAULT_ORDER, OrderOption } from 'src/app/shared/const';
import { Failure } from 'src/app/shared/util/types/task';
import { BaseModel } from '../models/model';
import { Task } from 'src/app/shared/util/types/task';
import { ToastService } from 'src/app/shared/services/toast.service';

/**
 * The strategy to be used when updating the index.
 */
export enum IndexStrategy {
  prependResult,
  appendResults,
  default,
}

/**
 * The state of the index.
 */
export interface IndexState<
  Entity extends HasId = HasId,
  Query extends BaseQuery = BaseQuery,
> {
  query: Query;
  data: Entity[];
  isBusy: boolean;
}

@Injectable()
export abstract class IndexUseCase<
  Model extends BaseModel = BaseModel,
  Query extends BaseQuery = BaseQuery,
> implements OnDestroy
{
  /**
   * The repository to be used to fetch the data.
   */
  protected readonly repository: BaseRepository<HasId, Query>;
  /**
   * The decoder to be used to decode the data.
   */
  protected readonly decoder: Decoder<Model >;
  /**
   * The initial query to be used.
   */
  protected readonly initialQuery: Partial<Query>;
  /**
   * The subscription to the typeahead.
   */
  private typeaheadSubscription: Subscription = new Subscription();
  /**
   * The subject to be used to emit the data.
   */
  private dataSubject: Subject<Model[]>;
  /**
   * The subject to be used to emit the typeahead.
   */
  public typeahead: Subject<string>;
  /**
   * The observable to be used to subscribe to the data.
   */
  public data$: Observable<Model[]>;
  /**
   * The query to be used.
   */
  public query: Partial<Query> | any;
  /**
   * The data fetched.
   */
  public data!: Model[];
  /**
   * The number of results.
   */
  public count: number;
  /**
   * Whether the index is busy.
   */
  public busy: boolean;
  /**
   * Whether the index is successful.
   */
  public isSuccess: boolean;
  /**
   * The result of the index.
   */
  private result!: Task<Index<Model >> | null;
  protected toastService!: ToastService;

  constructor(
    @Inject(null)
    args: {
      initialQuery: Partial<Query>;
      decoder: Decoder<Model >;
      repository: BaseRepository<HasId, Query>;
    },
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

  /**
   * Basically, it performs a fetch with a query.
   * It is used to search and filter the data.
   */
  async updateQuery(
    query: Partial<Query> | any,
    indexStrategy: IndexStrategy = IndexStrategy.default,
  ): Promise<Task<Index<Model >>> {
    // If the query is empty, then we just fetch the data.
    if (query == null)
      return Promise.resolve(this.result) as Promise<Task<Index<Model>>>;

    // If the query is the same as the previous one, then we do nothing.
    let nothingNew = true;
    Object.keys(query).forEach((key: any) => {
      if (this.query[key] !== query[key]) nothingNew = false;
    });
    if (nothingNew)
      return Promise.resolve(this.result) as Promise<Task<Index<Model>>>;

    // Otherwise, we update the query and fetch the data.
    this.query = { ...this.query, ...query };
    return await this.fetch(indexStrategy);
  }

  /**
   * Goes to the specified page.
   */
  async goToPage(
    page: number,
    indexStrategy = IndexStrategy.default,
  ): Promise<Task<Index<Model >> | null> {
    // If the page is the same as the previous one, then we do nothing.
    if (this.query.page === page)
      return (await Promise.resolve(this.result)) as unknown as Promise<
        Task<Index<Model>>
      >;
    // Otherwise, we update the query and fetch the data.
    return await this.updateQuery({ page } as Query, indexStrategy);
  }

  /**
   * This method is called when the user clicks on the "Previous" button.
   */
  async accumulateNextPage(): Promise<Task<
    Index<Model >
  > | null> {
    if (typeof this.query.page !== 'number' || this.query.page < 0)
      return (await Promise.resolve(this.result)) as unknown as Promise<
        Task<Index<Model>>
      >;
    return await this.goToPage(
      this.query.page + 1,
      IndexStrategy.appendResults,
    );
  }

  /**
   * Sorts the data by the specified column.
   */
  async sort(
    columnName: string,
  ): Promise<Task<Index<Model >> | null> {
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

  /**
   * Performs a search by the specified value.
   */
  async search(
    value: string,
  ): Promise<Task<Index<Model >> | null> {
    if (this.query.search != null && this.query.search === value)
      return (await Promise.resolve(this.result)) as unknown as Promise<
        Task<Index<Model>>
      >;
    return await this.updateQuery({
      search: value,
      page: this.initialQuery.page,
    } as Query);
  }

  /**
   * Updates the data by the specified id.
   * If the id is not found, then the data is not updated.
   */
  updateById(model: Model): Model[] {
    if (typeof model.id !== 'number') return this.data;
    const index = this.data.findIndex((el) => el.id === model.id);
    this.setData([
      ...this.data.slice(0, index),
      model,
      ...this.data.slice(index + 1, this.data.length),
    ]);
    return this.data;
  }

  /**
   * Retrieves the data from the server with no query
   */
  async fetch(
    indexStrategy: IndexStrategy = IndexStrategy.default,
  ): Promise<Task<Index<Model >>> {
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
        this.setData([
          ...this.data,
          ...(this.result?.data?.results as Model[]),
        ]);
      } else if (indexStrategy === IndexStrategy.prependResult) {
        this.setData([
          ...(this.result?.data?.results as Model[]),
          ...this.data,
        ]);
      } else {
        this.setData(this.result?.data?.results as Model[]);
      }
      this.count = this.result?.data?.count || this.data?.length;
    }
    return this.result;
  }

  /**
   * Utility method to track the data by id.
   */
  trackBy(instance: Model): number | null {
    if (instance == null) return null;
    return instance.id;
  }

  /**
   * Private method to set the data.
   */
  private setData(data: Model[]) {
    this.data = data;
    this.dataSubject.next(data as Model[]);
  }

  ngOnDestroy() {
    this.typeaheadSubscription?.unsubscribe();
  }
}
