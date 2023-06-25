import { Component, Input } from '@angular/core';
import { ListWithActionsUsecase } from 'src/app/domain/base/list-with-actions.usecase';

@Component({
  selector: 'app-page-table',
  templateUrl: './page-table.component.html',
  styleUrls: ['./page-table.component.scss'],
})
export class PageTableComponent {
  @Input() list!: ListWithActionsUsecase;
  @Input() loaded = true;
}
