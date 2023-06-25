import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { HomePageComponent } from './home-page.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { PageComponent } from './page/page.component';
import { PageTableComponent } from './page-table/page-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageFormComponent } from './page-form/page-form.component';
import { ModalPageComponent } from './modal-page/modal-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
     NgSelectModule
    ],
  declarations: [
    RootComponent,
    HomePageComponent,
    HeaderComponent,
    NavComponent,
    PageComponent,
    PageTableComponent,
    PageFormComponent,
    ModalPageComponent,
  ],
  exports: [PageComponent, PageTableComponent, PageFormComponent, ModalPageComponent],
})
export class RootModule {}
