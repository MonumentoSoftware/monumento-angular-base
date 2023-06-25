import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPreviewComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() title!: string;
  @Input() image!: string | Blob;

  _image: any;
  fileReader = new FileReader();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fileReader.onload = (e) => {
      this._image = this.fileReader.result;
      this.cd.detectChanges();
    };
  }

  ngAfterViewInit() {
    this.cd.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.image instanceof File) {
      this.fileReader.readAsDataURL(this.image);
    } else {
      this._image = this.image;
      this.cd.detectChanges();
    }
  }
}
