import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  @Input() debounce = 300;
  @Input() maxLength = 100;
  @Output() searchChange = new EventEmitter<string>();
}
