import { HttpErrorResponse } from '@angular/common/http';

const DEFAULT_ERROR_MESSAGE = 'Ocorreu um problema.';

export abstract class AppError {
  public abstract readonly message:string;
  public readonly items: any = {};

  protected constructor() {}

  static parse(response:HttpErrorResponse): AppError {
    console.log('[AppError] trying to parser error', response);

    let result: AppError;
    try {
      if (response instanceof HttpErrorResponse) {
        const message = response?.error?.message || response?.error?.detail || DEFAULT_ERROR_MESSAGE;

        switch (response.status) {
          case 400:
            result = new NotAcceptableError(message, response.error || {}) as unknown as AppError;
            break;
          case 401:
            result = new UnauthorizedError(message);
            break;
          case 403:
            result = new ForbiddenError(message);
            break;
          case 404:
            result = new NotFoundError(message);
            break;
          case 406:
            result = new NotAcceptableError(message, response.error.errors || {}) as unknown as AppError;
            break;
          case 413:
            result = new FileTooLargeError(message);
            break;
          case 500:
            result = new ServerError(message);
            break;
          default:
            result = new UnknownError(message);
        }
      } else {
        throw new Error(undefined);
      }
    } catch (error) {
      console.log('error parsing error', error);

      result = new UnknownError(response?.message || response?.error?.message || DEFAULT_ERROR_MESSAGE);
    }
    console.log('[AppError] parsed to', result);
    return result;
  }

  errorFor(field: string): null {
    return null;
  }

  errorsFor(field: string): string[] {
    return [];
  }
}

export class UnauthorizedError extends AppError {
  constructor(public readonly message = 'Credenciais inválidas') {
    super();
  }
}
export class ForbiddenError extends AppError {
  constructor(public readonly message = 'Acesso negado.') {
    super();
  }
}
export class NotFoundError extends AppError {
  constructor(public readonly message = 'Recurso não encontrado') {
    super();
  }
}
export class NotAcceptableError extends AppError {
  constructor(public readonly message = 'Arquivo acima do limite permitido', public override readonly items: any = {}) {
    super();
  }

  private accessNested(path: string) {
    const keys = path.split('.');

    const result = keys.reduce((acc, key) => {
      if (acc == null) return null;
      if (acc.hasOwnProperty(key)) return acc[key];
    }, this.items || {});

    return result;
  }

  override errorsFor(field: string): string[] {
    if (this.items == null) return [];

    const errors = this.accessNested(field);
    if (typeof errors === 'string') return [errors];
    else if (Array.isArray(errors) && typeof errors[0] === 'string') return errors;
    return [];
  }
}
export class FileTooLargeError extends AppError {
  constructor(public readonly message = 'Arquivo acima do limite permitido') {
    super();
  }
}
export class ServerError extends AppError {
  constructor(public readonly message = 'Ocorreu um erro') {
    super();
  }
}
export class UnknownError extends AppError {
  constructor(public readonly message = 'Ocorreu um problema') {
    super();
  }
}
