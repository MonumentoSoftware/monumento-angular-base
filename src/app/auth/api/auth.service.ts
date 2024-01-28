import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {
  Authenticated,
  AuthInit,
  AuthState,
  Unauthenticated,
  ValidatingToken,
} from './auth.state';
import { UserModel } from 'src/app/domain/models/user.model';
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
} from 'src/app/shared/util/errors/error';
import { Task, Success } from 'src/app/shared/util/types/task';
import { environment } from 'src/environments/environment';
import { UserEntity } from 'src/app/data/entities/user/user.entity';
import { Failure, Result } from '@app/shared/util/types/result';
import { LoginForm } from './login.service';

interface GoogleTokenResponse {
  auth_token: string;
  user: UserEntity;
}

/**
 * Credentials stored in the local storage
 * @property token - the authentication token
 * @property user - the user data
 */
interface Credentials {
  token: string;
  user: UserEntity;
}
/**
 * The key used to store the credentials in the local storage
 * @see Credentials
 */
const CREDENTIALS_KEY = 'credentials';

/**
 * The login response
 * @property auth_token - the authentication token
 * @property non_field_errors - the errors returned by the server
 * @property email - the errors returned by the server
 * @property password - the errors returned by the server
 * @see LoginForm
 */
interface LoginResponse {
  auth_token: string;
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
}

/**
 * The authentication service
 * It handles the authentication state, and the authentication requests
 * @property state - the authentication state
 * @property state$ - the authentication state observable
 * @property user - the user data
 * @property user$ - the user data observable
 * @property token - the authentication token
 * @property token$ - the authentication token observable
 * @see AuthState
 * @see Authenticated
 * @see Unauthenticated
 * @see ValidatingToken
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * The authentication state subject
   */
  private readonly stateSubject!: BehaviorSubject<AuthInit>;
  /**
   * The authentication state observable
   */
  public readonly state$!: Observable<AuthState | null>;
  /**
   * The authentication token observable
   */
  public readonly token$!: Observable<string | null>;
  /**
   * The user data observable
   */
  public readonly user$!: Observable<UserModel | null>;
  /**
   * The authentication state
   */
  public get state(): AuthState {
    return this.stateSubject.value;
  }
  /**
   * The user data
   */
  public get user(): UserModel {
    return this.stateSubject.value.user as UserModel;
  }
  /**
   * The authentication token
   */
  public get token(): string {
    return this.stateSubject.value.token as string;
  }
  /**
   * The url used to decode the google token in th server
   */
  private decodeGoogleUrl = `${environment.apiUrl}/user/decode`;

  constructor(private httpService: HttpClient) {
    // Create the authentication state subject
    this.stateSubject = new BehaviorSubject(new AuthInit());
    // Pipe the authentication state subject to the authentication state observable
    this.state$ = this.stateSubject.pipe(shareReplay());
    this.user$ = this.state$.pipe(map((s) => s!.user));
    this.token$ = this.state$.pipe(map((s) => s!.token));
    Promise.all([this.loadCredentials()]).then(this.handleFirstLoad.bind(this));
  }

  isLogged(): boolean {
    return this.user != null;
  }

  /**
   * A function that takes a google token and register the user
   * Or returns an error if any.
   */
  async signupWithGoogle(token: string): Promise<Result<GoogleTokenResponse>> {
    try {
      // Registers the user
      const response = await lastValueFrom(
        this.httpService.post<GoogleTokenResponse>(this.decodeGoogleUrl, {
          token,
        }),
      );
      return new Success(response);
    } catch (e) {
      return new Failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  /**
   * A function that takes a google token and login the user
   * @param auth_token The google token
   * @returns The user data
   */
  async loginWithGoogle(auth_token: string): Promise<Result<UserEntity>> {
    try {
      // Creates the authentication state
      this.stateSubject.next(new ValidatingToken(auth_token));
      // Getting the user data
      const selfTask = await this.getUser();
      if (selfTask.isSuccess) {
        this.handleLoginSucess(auth_token, selfTask.data as UserEntity);
      }
      return selfTask;
    } catch (e) {
      return new Failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async login({ email, password }: LoginForm): Promise<Task> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<LoginResponse>(
          `${environment.apiUrl}/auth/token/login/`,
          { email, password },
        ),
      );
      this.stateSubject.next(new ValidatingToken(response.auth_token));

      const selfTask = await this.getUser();

      if (selfTask.isSuccess) {
        this.handleLoginSucess(
          response.auth_token,
          selfTask.data as UserEntity,
        );
      }
      return selfTask;
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  /**
   * This function returns the user data from the server
   * @returns the user data
   */
  async getUser(): Promise<Task<UserEntity>> {
    try {
      const user = await lastValueFrom(
        this.httpService.get<UserEntity>(
          `${environment.apiUrl}/auth/users/me/`,
        ),
      );
      return Task.success(user);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  /**
   * This function handles the success of the login
   * @param token
   * @param user
   */
  private async handleLoginSucess(token: string, user: UserEntity) {
    const credentials = { user, token };
    await this.saveCredentials(credentials);
    this.stateSubject.next(
      new Authenticated(credentials.token, UserModel.decoder(credentials.user)),
    );
  }

  async perfomLogout() {
    try {
      await this.safeCleanCredentials();

      await lastValueFrom(
        this.httpService.post<any>(
          `${environment.apiUrl}/auth/token/logout/`,
          {},
        ),
      );
      return Task.success(null);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }
  async logout(): Promise<boolean> {
    const result = await this.perfomLogout();
    if (result.isSuccess) {
      this.stateSubject.next(new Unauthenticated());
      return true;
    }
    return false;
  }

  async requestPasswordReset<T>(email: string): Promise<Task<T>> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${environment.apiUrl}/auth/users/reset_password/`,
          { email },
        ),
      );
      return Task.success(response as T);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async changePassword(
    newPassword: string,
    uid: string,
    token: string,
  ): Promise<Task> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${environment.apiUrl}/auth/users/set_password/`,
          {
            new_password: newPassword,
            re_new_password: newPassword,
            uid,
            token,
          },
        ),
      );
      return Task.success(response);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async firstPassword(password: string, token: string): Promise<Task> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${environment.apiUrl}/auth/users/set_password/`,
          {
            new_password: password,
            current_password: password,
            token,
          },
        ),
      );

      return Task.success(response);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  private async handleFirstLoad([credentials]: [Credentials]) {
    if (credentials == null) {
      this.stateSubject.next(new Unauthenticated());
    } else {
      this.stateSubject.next(new ValidatingToken(credentials.token));

      // we already have login credentials
      // let's try to validate the credentials
      const selfResult = await this.getUser();
      if (selfResult instanceof Success) {
        this.handleLoginSucess(this.token, selfResult.data);
      } else if (
        selfResult.error instanceof UnauthorizedError ||
        selfResult.error instanceof ForbiddenError
      ) {
        await this.safeCleanCredentials();
        this.stateSubject.next(new Unauthenticated());
      } else {
        // server error or connection error, we don't need to invalidate the session
        this.stateSubject.next(
          new Authenticated(
            credentials.token,
            UserModel.decoder(credentials.user),
          ),
        );
      }
    }
  }

  // TODO: extract these methods that deal with Storage to a separate service

  /**
   * This function saves the credentials in the local storage
   * @param credentials
   */
  private async saveCredentials(credentials: Credentials): Promise<void> {
    try {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error(error);
    }
  }

  private async loadCredentials(): Promise<Credentials> {
    try {
      const raw = localStorage.getItem(CREDENTIALS_KEY);
      const credentials = JSON.parse(raw as string);

      if (
        typeof credentials.token === 'string' &&
        credentials.token.length > 0 &&
        credentials.user != null
      ) {
        return {
          token: credentials.token,
          user: credentials.use,
        };
      } else {
        await this.safeCleanCredentials();
        return null as unknown as Credentials;
      }
    } catch (error) {
      await this.safeCleanCredentials();
      return null as unknown as Credentials;
    }
  }

  private async safeCleanCredentials(): Promise<void> {
    try {
      await localStorage.removeItem(CREDENTIALS_KEY);
    } catch (error) {
      console.error(error);
    }
  }
}
