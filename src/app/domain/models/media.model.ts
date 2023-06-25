import { HasId } from "src/app/data/base/has-id";

export class UploadingMedia {
  file!: File;
  dataUrl!: string;
}

export interface Media {
  picture: string;
}

export class UploadedMedia<T extends Media & HasId> {
  constructor(public readonly model: T) {}
}
