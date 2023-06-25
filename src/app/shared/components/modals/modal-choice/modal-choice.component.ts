import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-choice',
  templateUrl: './modal-choice.component.html',
  styleUrls: ['./modal-choice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalChoiceComponent {
  @Input() header!: string;
  @Input() subtitle!: string;
  @Input() message!: string;
  @Input() confirmLabel!: string;
  @Input() cancelLabel!: string;
  @Input() severity!: 'warning' | 'danger';

  constructor(private modalController: ModalController) {}

  dismiss(answer?: boolean) {
    this.modalController.dismiss({ answer });
  }
}
