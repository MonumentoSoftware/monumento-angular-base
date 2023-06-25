import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Authenticated, AuthInit, AuthState, Unauthenticated, ValidatingToken } from './auth.state';
import { UserEntity } from 'src/app/data/entities/user.entity';
import { UserModel } from 'src/app/domain/models/user.model';
import { AppError, UnauthorizedError, ForbiddenError } from 'src/app/shared/util/errors/error';
import { Task, Success } from 'src/app/shared/util/types/task';
import { environment } from 'src/environments/environment';

interface Credentials {
  token: string;
  user: UserEntity;
}
const CREDENTIALS_KEY = 'credentials';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  auth_token: string;
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly stateSubject!: BehaviorSubject<AuthInit>;
  public readonly state$: Observable<AuthState | undefined>;
  public readonly token$: Observable<string | undefined>;
  public readonly user$!: Observable<UserModel | undefined>;

  public get state(): AuthState {
    return this.stateSubject.value;
  }
  public get user(): UserModel {
    return this.stateSubject.value.user as UserModel;
  }
  public get token(): string {
    return this.stateSubject.value.token as string;
  }

  constructor(private httpService: HttpClient) {
    this.stateSubject = new BehaviorSubject(new AuthInit());
    this.state$ = this.stateSubject.pipe(shareReplay(1));
    this.user$ = this.state$.pipe(map((s) => s?.user));
    this.token$ = this.state$.pipe(map((s) => s?.token));

    Promise.all([this.loadCredentials()]).then(this.handleFirstLoad.bind(this));
  }

  async login({ email, password }: LoginForm): Promise<Task> {
    try {
      const response = await lastValueFrom(this.httpService.post<LoginResponse>(`${environment.apiUrl}/auth/token/login/`, { email, password }))

      this.stateSubject.next(new ValidatingToken(response.auth_token));

      const selfTask = await this.self();

      if (selfTask.isSuccess) {
        this.handleSelfSuccess(response.auth_token, selfTask.data as UserEntity);
      }
      return selfTask;
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async self(): Promise<Task<UserEntity>> {
    try {
      const user = await lastValueFrom(this.httpService.get<UserEntity>(`${environment.apiUrl}/auth/users/me/`));

      return Task.success(user);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  private async handleSelfSuccess(token: string, user: UserEntity) {
    const credentials = { user, token };
    await this.saveCredentials(credentials);
    this.stateSubject.next(new Authenticated(credentials.token, UserModel.decoder(credentials.user)));
  }

  async logout() {
    try {
      await this.safeCleanCredentials();
      this.stateSubject.next(new Unauthenticated());
      await lastValueFrom(this.httpService.post<any>(`${environment.apiUrl}/auth/token/logout/`, {}));
    } catch (e) { }
  }

  async requestPasswordReset<T>(email: string): Promise<Task<T>> {
    try {
      const response = await lastValueFrom(this.httpService.post(`${environment.apiUrl}/auth/users/reset_password/`, { email }));
      return Task.success(response as T);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async changePassword(newPassword: string, uid: string, token: string): Promise<Task> {
    try {
      const response = await this.httpService
        .post(`${environment.apiUrl}/auth/users/set_password/`, {
          new_password: newPassword,
          re_new_password: newPassword,
          uid,
          token,
        })
        .toPromise();
      return Task.success(response);
    } catch (e) {
      return Task.failure(AppError.parse(e as HttpErrorResponse));
    }
  }

  async firstPassword(password: string, token: string): Promise<Task> {
    try {
      const response = await lastValueFrom(this.httpService
        .post(`${environment.apiUrl}/auth/users/set_password/`, {
          new_password: password,
          current_password: password,
          token,
        }))
        
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
      const selfResult = await this.self();
      if (selfResult instanceof Success) {
        this.handleSelfSuccess(this.token, selfResult.data);
      } else if (selfResult.error instanceof UnauthorizedError || selfResult.error instanceof ForbiddenError) {
        await this.safeCleanCredentials();
        this.stateSubject.next(new Unauthenticated());
      } else {
        // server error or connection error, we don't need to invalidate the session
        this.stateSubject.next(new Authenticated(credentials.token, UserModel.decoder(credentials.user)));
      }
    }
  }

  // TODO: extract these methods that deal with Storage to a separate service

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

      if (typeof credentials.token === 'string' && credentials.token.length > 0 && credentials.user != null) {
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
