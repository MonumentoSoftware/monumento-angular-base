import { Task } from '@app/shared/util/types/task';

export interface SingleTaskUseCase<S, T> {
  execute(params: S): Promise<Task<T>>;
}
