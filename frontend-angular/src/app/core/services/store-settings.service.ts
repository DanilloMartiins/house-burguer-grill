import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { API_BASE_URL, USE_MOCK_PUBLIC_DATA } from '../constants/api.constants';
import { PUBLIC_STORE_SETTINGS_MOCK } from '../mocks/public-data.mock';
import { StoreSettingsResponse, UpdateStoreSettingsRequest } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class StoreSettingsService {
  private readonly http = inject(HttpClient);

  getPublicStoreSettings(): Observable<StoreSettingsResponse> {
    if (USE_MOCK_PUBLIC_DATA) {
      return of(PUBLIC_STORE_SETTINGS_MOCK);
    }

    return this.http
      .get<StoreSettingsResponse>(`${API_BASE_URL}/public/store-settings`)
      .pipe(catchError(() => of(PUBLIC_STORE_SETTINGS_MOCK)));
  }

  getAdminStoreSettings(): Observable<StoreSettingsResponse> {
    return this.http.get<StoreSettingsResponse>(`${API_BASE_URL}/admin/store-settings`);
  }

  updateAdminStoreSettings(payload: UpdateStoreSettingsRequest): Observable<StoreSettingsResponse> {
    return this.http.put<StoreSettingsResponse>(`${API_BASE_URL}/admin/store-settings`, payload);
  }
}
