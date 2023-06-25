import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/*
 * CSS CUSTOM PROPERTIES
 *    --color:          main color
 *    --contrast-color: icon color when the button is hovered
 * */
@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() routerLink!: string;
  @Input() color!: string;
  @Input() label!: string;
  @Input() ionIconName!: string;
  @Input() iconFile!: string;
}
