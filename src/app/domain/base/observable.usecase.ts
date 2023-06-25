import { Observable } from 'rxjs';

export interface ObservableUseCase<State, Action> {
  state$: Observable<State>;
  dispatch(action: Action): void;

  init(initialState: State): Observable<State>;
}
