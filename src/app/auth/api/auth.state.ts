import { UserModel } from 'src/app/domain/models/user.model';

/**
 * Base abstract class that represents the state of the authentication.
 * It is used to know if the user is authenticated or not.
 */
export abstract class AuthState {
  public readonly token: string | null = null;
  public readonly user: UserModel | null = null;
  public abstract readonly resolved: boolean;
}

/**
 * Initial state of the authentication.
 */
export class AuthInit extends AuthState {
  public readonly resolved: boolean = false;
  constructor() {
    super();
  }
}

/**
 * State of the authentication when the token is being validated.
 */
export class ValidatingToken extends AuthState {
  public readonly resolved = false;
  constructor(public override readonly token: string) {
    super();
    this.token = token as string;
  }
}
/**
 * State of the authentication when the token is valid.
 */
export class Authenticated extends AuthState {
  public readonly resolved: boolean = true;
  constructor(
    public override readonly token: string,
    public override readonly user: UserModel,
  ) {
    super();
  }
}
/**
 * State of the authentication when the token is invalid.
 */
export class Unauthenticated extends AuthState {
  public readonly resolved: boolean = true;
}
