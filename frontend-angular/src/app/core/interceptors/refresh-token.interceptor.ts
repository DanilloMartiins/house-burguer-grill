import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from '../services/auth.service';

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
const RETRY_HEADER = 'x-auth-retry';

export const refreshTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const isApiCall = request.url.startsWith(API_BASE_URL);
      const isAuthRequest = AUTH_PATHS.some((path) => request.url.includes(path));
      const alreadyRetried = request.headers.has(RETRY_HEADER);

      if (!isApiCall || isAuthRequest || alreadyRetried || error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((token) =>
          next(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                [RETRY_HEADER]: 'true',
              },
            }),
          ),
        ),
        catchError((refreshError) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
