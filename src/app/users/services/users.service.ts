import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/auth.interfaces';
import { Options } from '@shared/interfaces/shared.interfaces';
import { UsersResponse } from '@users/interfaces/users.interfaces';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const urlBase = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  userCache = new Map<string, User[]>();

  getAllUsers(options: Options, clear: boolean = false): Observable<User[]> {
    console.log(this.userCache);
    const { limit = 9, offset = 0 } = options;
    const key = `${limit}-${offset}`;
    if (this.userCache.has(key) && !clear) return of(this.userCache.get(key)!);

    return this.http
      .get<UsersResponse>(`${urlBase}/auth/list-users`, {
        params: {
          limit: limit,
          offset: offset,
        },
      })
      .pipe(
        tap((resp) => {
          this.userCache.set(key, resp.users);
        }),
        map((resp) => resp.users)
      );
  }

  deleteLogicUserById(id: string): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${urlBase}/auth`, {
        params: {
          id,
        },
      })
      .pipe(
        tap(() => {
          this.userCache.clear();
          this.getAllUsers({}, true).subscribe();
        }),
        map((data) => data.message),
        catchError((error) => throwError(() => error))
      );
  }
}
