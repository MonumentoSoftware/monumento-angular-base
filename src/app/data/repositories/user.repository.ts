import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from '../base/base-repository';
import { Decoder } from 'src/app/domain/base/decoder';
import { BaseQuery } from 'src/app/domain/base/query';
import { BaseModel } from 'src/app/domain/models/model';
import { AppError } from 'src/app/shared/util/errors/error';
import { Success, Failure } from 'src/app/shared/util/types/task';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Task } from 'src/app/shared/util/types/task';
import { UserEntity } from '../entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserRepository extends BaseRepository<UserEntity, BaseQuery> {
  indexUrl = 'user/users';
  showUrl = 'user/users/:id';
  createUrl = 'user/users';
  editUrl = 'user/users/:id';
  deleteUrl = 'user/users/:id';
  userFavoritesUrl = 'user/users/favorites';

  constructor(protected readonly http: HttpClient) {
    super();
  }

  async saveFormData<T extends BaseModel>(
    form: FormData,
    decode: Decoder<T>,
  ): Promise<Task<T>> {
    try {
      const isEdit = form.get('id') != null;
      const id = form.get('id') as FormDataEntryValue;

      let request, url;

      if (isEdit) {
        url = `${environment.apiUrl}/${this.editUrl}/`.replace(
          /:id/g,
          id.toString(),
        );
        request = this.http.patch<UserEntity>(url, form);
      } else {
        url = `${environment.apiUrl}/${this.createUrl}/`;
        request = this.http.post<UserEntity>(url, form);
      }

      const res = await lastValueFrom(request);

      return new Success(decode(res));
    } catch (error) {
      return new Failure(AppError.parse(error as HttpErrorResponse));
    }
  }

}
