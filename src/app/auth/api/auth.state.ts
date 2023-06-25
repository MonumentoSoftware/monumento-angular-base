import { UserModel } from "src/app/domain/models/user.model";

export abstract class AuthState {
  public readonly token?: string
  public readonly user?: UserModel;
  public abstract readonly resolved: boolean;
}

export class AuthInit extends AuthState {
  public readonly resolved: boolean = false;
  constructor() {
    super()
  }
}

export class ValidatingToken extends AuthState {
  public readonly resolved = false;
  constructor(public override readonly token: string) {
    super();
    this.token = token as string;
  }
}

export class Authenticated extends AuthState {
  public readonly resolved:boolean = true;
  constructor(public override readonly token: string, public override readonly user: UserModel) {
    super();
  }
}
export class Unauthenticated extends AuthState {
  public readonly resolved:boolean = true;
}
