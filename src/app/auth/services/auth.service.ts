import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { AuthResponse } from '@auth/interfaces/auth-response.interfaces';
import type { Register, User } from '@auth/interfaces/auth.interfaces';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    request: () => ({}),
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    return this._user() ? 'authenticated' : 'no-authenticated';
  });

  user = computed<User | null>(() => this._user());

  token = computed(this._token);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((resp) => {
          this.handleAuthSuccess(resp);
        }),
        map(() => true),
        catchError((error: any) => {
          this.logout();
          return of(false);
        })
      );
  }

  register(payload: Register): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, payload)
      .pipe(
        tap((resp) => {
          this.handleAuthSuccess(resp);
        }),
        map(() => true),
        catchError((error) => {
          this.logout();
          return of(false);
        })
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {}).pipe(
      tap((resp) => {
        console.log(resp);
        this.handleAuthSuccess(resp);
      }),
      map(() => true),
      catchError((error: any) => {
        this.logout();
        return of(false);
      })
    );
  }

  logout() {
    this._authStatus.set('no-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._authStatus.set('authenticated');
    this._token.set(resp.token);
    this._user.set(resp.user);
    localStorage.setItem('token', resp.token);
  }
}
