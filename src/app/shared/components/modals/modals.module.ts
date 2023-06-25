import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalChoiceComponent } from './modal-choice/modal-choice.component';

@NgModule({
  declarations: [ModalChoiceComponent],
  exports: [ModalChoiceComponent],
  imports: [CommonModule, IonicModule],
})
export class ModalsModule {}
