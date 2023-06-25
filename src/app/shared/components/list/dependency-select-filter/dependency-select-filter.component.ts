import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, SubscriptionLike} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {BaseModel} from '@app/domain/models/model';
import {IndexUseCase} from '@app/domain/base/index.usecase';

@Component({
  selector: 'app-dependency-select-filter',
  templateUrl: './dependency-select-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencySelectFilterComponent implements OnInit, OnDestroy {
  debouncerTypeahed = new Subject<string>();
  private typeaheadSubscription: SubscriptionLike;

  @Input() indexUsecase: IndexUseCase;
  @Input() queryKey: string;
  @Input() selected: number[];
  @Input() label: string;
  get entities$() {
    return this.indexUsecase.data$.pipe(map((data) => data.map((model) => model.entity)));
  }
  @Output() dependencyChange = new EventEmitter<number[]>();

  @Input() bindLabel = 'name';
  @Input() bindValue = 'id';
  @Input() typeToSearchText = 'Digite 3 ou mais caracteres';
  @Input() minTermLength = 3;
  @Input() multiple = true;
  @Input() debounceTime = 500;
  @Input() trackByFn: (el: unknown) => unknown = (el) => el[this.bindValue];
  @Input() transformSelectedFn: (el: unknown) => number = (el) => (el ? el[this.bindValue] : null);

  handleChange(selected: Array<BaseModel> | BaseModel) {
    let newSelected;
    if (selected instanceof Array) {
      newSelected = selected.map(this.transformSelectedFn);
    } else {
      newSelected = this.transformSelectedFn(selected);
    }
    this.dependencyChange.emit(newSelected);
  }

  ngOnInit() {
    this.typeaheadSubscription = this.debouncerTypeahed
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap((search) => this.indexUsecase.search(search))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.typeaheadSubscription?.unsubscribe();
  }

  /*
  fix ng-select typeahead minlength bug

  BUG DESCRIPTION:
    when the search text length is smaller than the
  minTermLength the change it doesn't emit any value. Because of this
  when there is one more character than minTermLength and the user presses backspace,
  the change event is not triggered and the list of options is not updated.
  */
  inputChanged($event) {
    if ($event.target.value.length < this.minTermLength) {
      this.debouncerTypeahed.next(null);
    }
  }
}
