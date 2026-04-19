import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';

import { API_BASE_URL, AUTH_STORAGE_KEY } from '../constants/api.constants';
import {
  AuthSession,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  RoleName,
  TokenResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly sessionSignal = signal<AuthSession | null>(this.readSession());
  private refreshRequest$: Observable<string> | null = null;

  readonly session = computed(() => this.sessionSignal());
  readonly role = computed<RoleName | null>(() => this.sessionSignal()?.role ?? null);
  readonly email = computed<string | null>(() => this.sessionSignal()?.email ?? null);
  readonly isAuthenticated = computed<boolean>(() => {
    const session = this.sessionSignal();
    return Boolean(session && session.expiresAt > Date.now());
  });
  readonly isAdmin = computed<boolean>(() => this.role() === 'ADMIN');

  login(payload: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API_BASE_URL}/auth/login`, payload)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(payload: RegisterRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API_BASE_URL}/auth/register`, payload)
      .pipe(tap((response) => this.setSession(response)));
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.sessionSignal()?.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('Sessao expirada.'));
    }

    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    this.refreshRequest$ = this.http
      .post<TokenResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken } satisfies RefreshRequest)
      .pipe(
        tap((response) => this.setSession(response)),
        map((response) => response.accessToken),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay(1),
      );

    return this.refreshRequest$;
  }

  logout(): Observable<void> {
    const refreshToken = this.sessionSignal()?.refreshToken;
    this.clearSession();

    if (!refreshToken) {
      return of(void 0);
    }

    return this.http
      .post<void>(`${API_BASE_URL}/auth/logout`, { refreshToken } satisfies LogoutRequest)
      .pipe(catchError(() => of(void 0)));
  }

  getAccessToken(): string | null {
    const session = this.sessionSignal();

    if (!session || session.expiresAt <= Date.now()) {
      return null;
    }

    return session.accessToken;
  }

  clearSession(): void {
    this.sessionSignal.set(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private setSession(tokenResponse: TokenResponse): void {
    const claims = decodeJwtClaims(tokenResponse.accessToken);
    const expiresAt = claims.exp ? claims.exp * 1000 : Date.now() + tokenResponse.expiresIn * 1000;

    const session: AuthSession = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      role: resolveRole(claims.role, claims.roles),
      email: typeof claims.sub === 'string' ? claims.sub : null,
      expiresAt,
    };

    this.sessionSignal.set(session);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  private readSession(): AuthSession | null {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawSession) as Partial<AuthSession>;

      if (
        typeof parsed.accessToken !== 'string' ||
        typeof parsed.refreshToken !== 'string' ||
        typeof parsed.expiresAt !== 'number'
      ) {
        return null;
      }

      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        role: parsed.role === 'ADMIN' || parsed.role === 'CUSTOMER' ? parsed.role : null,
        email: typeof parsed.email === 'string' ? parsed.email : null,
        expiresAt: parsed.expiresAt,
      };
    } catch {
      return null;
    }
  }
}

type JwtClaims = {
  sub?: unknown;
  exp?: number;
  role?: unknown;
  roles?: unknown;
};

function decodeJwtClaims(token: string): JwtClaims {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) {
    return {};
  }

  try {
    const payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload) as JwtClaims;
  } catch {
    return {};
  }
}

function resolveRole(roleClaim: unknown, rolesClaim: unknown): RoleName | null {
  const singleRole = normalizeRole(roleClaim);
  if (singleRole) {
    return singleRole;
  }

  if (Array.isArray(rolesClaim)) {
    const matchedRole = rolesClaim.map((entry) => normalizeRole(entry)).find((entry) => Boolean(entry));
    return matchedRole ?? null;
  }

  if (typeof rolesClaim === 'string') {
    return normalizeRole(rolesClaim);
  }

  return null;
}

function normalizeRole(input: unknown): RoleName | null {
  if (typeof input !== 'string') {
    return null;
  }

  const normalizedRole = input.toUpperCase().replace('ROLE_', '');
  if (normalizedRole === 'ADMIN' || normalizedRole === 'CUSTOMER') {
    return normalizedRole;
  }

  return null;
}
