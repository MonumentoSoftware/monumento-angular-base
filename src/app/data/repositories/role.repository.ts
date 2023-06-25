import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from '../base/base-repository';
import { RoleEntity } from '../entities/role.entity';
import { BaseQuery } from 'src/app/domain/base/query';
import { AppError } from 'src/app/shared/util/errors/error';
import { Success, Failure } from 'src/app/shared/util/types/task';
import { environment } from 'src/environments/environment';
import { PermissionChangeEntity } from '../entities/permission-change.entity';
import { Task } from 'src/app/shared/util/types/task';
@Injectable({
  providedIn: 'root',
})
export class RoleRepository extends BaseRepository<RoleEntity, BaseQuery> {
  indexUrl = 'admin/roles';
  showUrl = 'admin/roles/:id';
  createUrl = 'admin/roles';
  editUrl = 'admin/roles/:id';
  deleteUrl = 'admin/roles/:id';
  changePermissionUrl = 'admin/roles/:id/permissions';

  constructor(protected readonly http: HttpClient) {
    super();
  }

  async changePermission(id: number, body: PermissionChangeEntity): Promise<Task> {
    try {
      const url = `${environment.apiUrl}/${this.changePermissionUrl}/`.replace(/:id/g, id.toString());
      const request = this.http.put<any>(url, body).toPromise();

      let res = await request;

      // workaround for MirageJs
      if (Object.keys(res).length === 1 && res.hasOwnProperty('data')) res = res.data;

      return new Success(res);
    } catch (error) {
      return new Failure(AppError.parse(error as HttpErrorResponse));
    }
  }
}
