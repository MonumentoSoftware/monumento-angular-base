import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Index } from './index-data';
import { HasId } from './has-id';
import { NotFoundError, lastValueFrom } from 'rxjs';
import { Decoder } from 'src/app/domain/base/decoder';
import { BaseQuery } from 'src/app/domain/base/query';
import { BaseModel } from 'src/app/domain/models/model';
import { AppError } from 'src/app/shared/util/errors/error';
import { Success, Failure } from 'src/app/shared/util/types/task';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/shared/util/types/task';
import { snakeCase } from 'snake-case';

interface QueryParams {
  [key: string]: string | string[];
}

export abstract class BaseRepository<
  Entity extends HasId = HasId,
  Query extends BaseQuery = BaseQuery,
  SaveArgs extends HasId = HasId
> {
  protected abstract readonly http: HttpClient;
  protected abstract readonly showUrl: string;
  protected abstract readonly indexUrl: string;
  protected abstract readonly editUrl: string;
  protected abstract readonly createUrl: string;
  protected abstract readonly deleteUrl: string;

  async show<Model extends BaseModel>(id: number, decode: Decoder<Model>): Promise<Task<Model>> {
    try {
      const baseUrl = environment.apiUrl;
      const showUrl = this.showUrl.replace(/:id/g, id.toString());
      let res = await lastValueFrom(this.http.get(`${baseUrl}/${showUrl}/`));

      // workaround for MirageJs
      if (Object.keys(res).length === 1 && res.hasOwnProperty('data')) {
        res = (res as { data: Entity }).data;
      }

      return new Success(decode(res as Entity));
    } catch (error ) {
      return new Failure(AppError.parse(error as HttpErrorResponse));
    }
  }

  async index<Model extends BaseModel>(query: Partial<Query>, decode: Decoder<Model>): Promise<Task<Index<Model>>> {
    try {
      const res = await lastValueFrom(this.http.get<Index<Entity>>(`${environment.apiUrl}/${this.indexUrl}/`, { params: this.queryToParams(query) }))
     

      return new Success({ ...res, results: res?.results?.map(decode) });
    } catch (e) {
      const error = AppError.parse(e as HttpErrorResponse);
      if (error instanceof NotFoundError) return new Success({ count: 0, next: null, previous: null, results: [] });
      return new Failure(error);
    }
  }

  async save<Model extends BaseModel>(form: SaveArgs, decode: Decoder<Model>): Promise<Task<Model>> {
    try {
      const isEdit = form.id != null;
      let request, url;

      if (isEdit) {
        url = `${environment.apiUrl}/${this.editUrl}/`.replace(/:id/g, form.id.toString());
        request = this.http.patch<Entity>(url, form)
      } else {
        url = `${environment.apiUrl}/${this.createUrl}/`;
        request = this.http.post<Entity>(url, form);
      }

      let res = await lastValueFrom(request);

      // workaround for MirageJs
      if (Object.keys(res).length === 1 && res.hasOwnProperty('data')) res = res;

      return new Success(decode(res));
    } catch (error) {
      return new Failure(AppError.parse(error as HttpErrorResponse));
    }
  }

  async delete(id: string | number): Promise<Task> {
    try {
      await lastValueFrom(this.http.delete(`${environment.apiUrl}/${this.deleteUrl.replace(/:id/g, id.toString())}/`));
      return new Success(null);
    } catch (error) {
      return new Failure(AppError.parse(error as HttpErrorResponse));
    }
  }

  protected queryToParams(query: Partial<Query>): QueryParams {
    if (query == null) return {};
    return Object.entries(query).reduce((acc:any, [key, value]) => {
      if (value == null || value === '') return acc;

      key = snakeCase(key);
      if (Array.isArray(value) && value.length > 0) {
        acc[key] = value.map(this.valueToString).join(',');
      } else {
        if (key === 'sort') value = snakeCase(value);
        if (key === 'page') value = value + 1; // backend expects page=1 as the start

        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private valueToString(v: unknown): string | null {
    if (v == null) return null;
    if (typeof v === 'string') return v;
    if (v.toString != null) return v.toString();
    return null;
  }
}
