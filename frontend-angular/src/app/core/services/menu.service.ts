import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { API_BASE_URL, USE_MOCK_PUBLIC_DATA } from '../constants/api.constants';
import { PUBLIC_MENU_MOCK } from '../mocks/public-data.mock';
import {
  CreateProductRequest,
  MenuCategoryResponse,
  ProductResponse,
  UpdateProductRequest,
  UploadImageResponse,
} from '../models/menu.models';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  getPublicMenu(): Observable<MenuCategoryResponse[]> {
    if (USE_MOCK_PUBLIC_DATA) {
      return of(PUBLIC_MENU_MOCK);
    }

    return this.http
      .get<MenuCategoryResponse[]>(`${API_BASE_URL}/public/menu`)
      .pipe(catchError(() => of(PUBLIC_MENU_MOCK)));
  }

  getAdminProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${API_BASE_URL}/admin/products`);
  }

  createAdminProduct(payload: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${API_BASE_URL}/admin/products`, payload);
  }

  updateAdminProduct(id: number, payload: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${API_BASE_URL}/admin/products/${id}`, payload);
  }

  deleteAdminProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/admin/products/${id}`);
  }

  uploadProductImage(file: File): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadImageResponse>(`${API_BASE_URL}/admin/products/image`, formData);
  }
}
