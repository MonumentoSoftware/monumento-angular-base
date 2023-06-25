import {Component, Input} from '@angular/core';

/* CSS CUSTOM PROPERTIES
  --l1-font-size:   first line font size
  --l1-font-weight: first line font weight
  --l1-color:       first line text color
  --l2-font-size:   second line font size
  --l2-font-weight: second line font weight
  --l2-color:       second line text color
 * */
@Component({
  selector: 'app-two-line-column',
  templateUrl: './two-line-column.component.html',
  styleUrls: ['two-line-column.component.scss'],
})
export class TwoLineColumnComponent {
  @Input() line1: string;
  @Input() line2: string;
}
