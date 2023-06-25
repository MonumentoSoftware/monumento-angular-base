import { VideoEntity } from '@app/data/entities/video.entity';
import { BaseModel } from './model';

export class VideoModel extends BaseModel<VideoEntity> {
  constructor(entity: Partial<VideoEntity>) {
    super(entity);
  }

  static decoder(entity: VideoEntity): VideoModel {
    return new VideoModel(entity);
  }
}
