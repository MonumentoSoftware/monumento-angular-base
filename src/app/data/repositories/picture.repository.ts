import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from '../base/base-repository';
import { PictureEntity } from '@app/data/entities/picture.entity';
import { BaseQuery } from '@app/domain/base/query';
import { Failure, Task, Success } from '@app/shared/util/types/task';
import { environment } from '@environments/environment';
import { AppError } from '@app/shared/util/errors/error';
import { UploadedMedia } from '@app/domain/models/media.model';

@Injectable({
  providedIn: 'root',
})
export class PictureRepository extends BaseRepository<PictureEntity, BaseQuery> {
  indexUrl = 'admin/accessories/:accessoryId/pictures';
  showUrl = 'admin/accessory/pictures/:id';
  createUrl = 'admin/accessories/:accessoryId/pictures';
  editUrl = 'admin/accessory/pictures/:id';
  deleteUrl = 'admin/accessory/pictures/:id';

  constructor(protected readonly http: HttpClient) {
    super();
  }

  async saveAccessoryPicture(accessoryId: number, form: FormData): Promise<Task<UploadedMedia<PictureEntity>>> {
    try {
      let request, url;

      url = `${environment.apiUrl}/${this.createUrl.replace(/:accessoryId/g, accessoryId.toString())}/`;
      request = this.http.post<PictureEntity>(url, form).toPromise();

      let res = await request;

      // workaround for MirageJs
      if (Object.keys(res).length === 1 && res.hasOwnProperty('data')) res = res.data;

      return new Success(new UploadedMedia(res));
    } catch (error) {
      return new Failure(AppError.parse(error));
    }
  }
}
