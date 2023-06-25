import { NgModule } from '@angular/core';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SimpleSelectFilterComponent } from './simple-select-filter/simple-select-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@app/shared/shared.module';
import { DependencySelectFilterComponent } from './dependency-select-filter/dependency-select-filter.component';
import { CheckboxColumnComponent } from './checkbox-column/checkbox-column.component';
import { TextColumnComponent } from './text-column/text-column.component';
import { TwoLineColumnComponent } from './two-line-column/two-line-column.component';

@NgModule({
  declarations: [
    SearchFilterComponent,
    SimpleSelectFilterComponent,
    DependencySelectFilterComponent,
    CheckboxColumnComponent,
    TextColumnComponent,
    TwoLineColumnComponent,
  ],
  imports: [SharedModule, NgSelectModule],
  exports: [
    SearchFilterComponent,
    SimpleSelectFilterComponent,
    DependencySelectFilterComponent,
    CheckboxColumnComponent,
    TextColumnComponent,
    TwoLineColumnComponent,
  ],
})
export class ListModule {}
