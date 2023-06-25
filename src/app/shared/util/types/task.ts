import { AppError } from "../errors/error";

export abstract class Task<T = any> {
  public abstract readonly data: T | null;
  public abstract readonly error: AppError | null;
  public abstract readonly isSuccess: boolean;
  public abstract readonly isFailure: boolean;

  public static idle(): Idle {
    return new Idle();
  }

  public static success<T>(data: T): Success<T> {
    return new Success(data);
  }

  public static failure(data: AppError): Failure {
    return new Failure(data);
  }
}

export class Idle<T = any> extends Task<T> {
  public readonly error = null;
  public readonly isSuccess = false;
  public readonly isFailure = false;
  constructor(public readonly data: T = null as T) {
    super();
    this.data = data;
  }
}

export class Success<T = any> extends Task<T> {
  public readonly error: any = null;
  public readonly isSuccess = true;
  public readonly isFailure = false;
  constructor(public readonly data: T) {
    super();
    this.data = data;
  }
}

export class Failure<T = any> extends Task<T> {
  public readonly data = null;
  public readonly isSuccess = false;
  public readonly isFailure = true;
  constructor(public readonly error: AppError) {
    super();
  }
}
