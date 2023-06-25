import { Component, Input } from '@angular/core';

/*
 * CSS CUSTOM PROPERTIES
 *    --lines:        number of lines to show
 *    --font-size:    font size
 *    --font-weight:  font weight
 *    --text-color:   text color
 * */
@Component({
  selector: 'app-text-column',
  templateUrl: './text-column.component.html',
  styleUrls: ['text-column.component.scss'],
})
export class TextColumnComponent {
  @Input() text: string;
}
