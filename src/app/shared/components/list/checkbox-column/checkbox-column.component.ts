import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ColorType } from '@app/shared/util/types/color';

@Component({
  selector: 'app-checkbox-column',
  templateUrl: './checkbox-column.component.html',
  styleUrls: ['checkbox-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxColumnComponent {
  @Input() text: string;
  @Input() color: ColorType;
  @Input() checked: boolean;
  @Output() checkChange = new EventEmitter<boolean>();
}
