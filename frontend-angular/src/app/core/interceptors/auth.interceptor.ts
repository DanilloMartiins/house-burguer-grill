import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from '../services/auth.service';

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  if (!request.url.startsWith(API_BASE_URL) || AUTH_PATHS.some((path) => request.url.includes(path))) {
    return next(request);
  }

  const token = authService.getAccessToken();
  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
