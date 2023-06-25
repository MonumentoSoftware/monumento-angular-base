import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

interface Option {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-simple-select-filter',
  templateUrl: './simple-select-filter.component.html',
  styleUrls: ['./simple-select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectFilterComponent {
  @Input() items: Option[] = [];
  @Input() selected: unknown;
  @Input() multiple = false;
  @Input() placeholder = this.multiple ? 'Selecione uma ou mais opções' : 'Selecione uma opção';
  @Input() label: string;
  @Output() selectChange = new EventEmitter<unknown>();

  handleChange(value: Option | Option[]) {
    let emitValue;
    if (value == null) emitValue = value;
    else if (Array.isArray(value)) {
      emitValue = value.map((v) => v.value);
    } else emitValue = value.value;
    this.selectChange.emit(emitValue);
  }
}
