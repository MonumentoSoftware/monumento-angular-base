import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HeaderSearchComponent} from './components/header-search/header-search.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { CardPreviewComponent } from './components/image-preview/card-preview.component';
import { ModalsModule } from './components/modals/modals.module';
import { ServerErrorsComponent } from './components/server-errors/server-errors.component';
import { StatusClassPipe } from './pipes/status-class.pipe';
import { StatusLabelPipe } from './pipes/status-label.pipe';
import { UserTypeLabelPipe } from './pipes/user-type-label.pipe';
import { ServerErrorsService } from './services/server-errors.service';
import { BadgeHomeComponent } from './components/badge-home/badge-home.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextInputComponent } from './components/text-input/text-input.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ModalsModule, NgSelectModule],
  declarations: [
    HeaderSearchComponent,
    ServerErrorsComponent,
    IconButtonComponent,
    CardPreviewComponent,
    StatusLabelPipe,
    StatusClassPipe,
    UserTypeLabelPipe,
    BadgeHomeComponent,
    TooltipComponent,
    TextInputComponent,
  ],
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderSearchComponent,
    ServerErrorsComponent,
    IconButtonComponent,
    ModalsModule,
    CardPreviewComponent,
    StatusLabelPipe,
    StatusClassPipe,
    UserTypeLabelPipe,
    BadgeHomeComponent,
    TooltipComponent,
    TextInputComponent,

  ],
  providers: [ServerErrorsService],
})
export class SharedModule {}
