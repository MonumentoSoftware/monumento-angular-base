import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from '../base/base-repository';
import { VideoEntity } from '@app/data/entities/video.entity';
import { BaseQuery } from '@app/domain/base/query';
import { Decoder } from '@app/domain/base/decoder';
import { Failure, Task, Success } from '@app/shared/util/types/task';
import { environment } from '@environments/environment';
import { AppError } from '@app/shared/util/errors/error';
import { VideoModel } from '@app/domain/models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoRepository extends BaseRepository<VideoEntity, BaseQuery> {
  indexUrl = 'admin/accessories/:accessoryId/videos';
  showUrl = 'admin/accessory/videos/:id';
  createUrl = 'admin/accessories/:accessoryId/videos';
  editUrl = 'admin/accessory/videos/:id';
  deleteUrl = 'admin/accessory/videos/:id';

  constructor(protected readonly http: HttpClient) {
    super();
  }

  async saveAccessoryVideo(
    accessoryId: number,
    form: VideoEntity,
    decode: Decoder<VideoModel>
  ): Promise<Task<VideoModel>> {
    try {
      const isEdit = form.id != null;
      let request, url;

      if (isEdit) {
        url = `${environment.apiUrl}/${this.editUrl}/`.replace(/:id/g, form.id.toString());
        request = this.http.patch<VideoEntity>(url, form).toPromise();
      } else {
        url = `${environment.apiUrl}/${this.createUrl.replace(/:accessoryId/g, accessoryId.toString())}/`;
        request = this.http.post<VideoEntity>(url, form).toPromise();
      }

      let res = await request;

      // workaround for MirageJs
      if (Object.keys(res).length === 1 && res.hasOwnProperty('data')) res = res.data;

      return new Success(decode(res));
    } catch (error) {
      return new Failure(AppError.parse(error));
    }
  }
}
