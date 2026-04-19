import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import {
  CreateOrderRequest,
  OrderResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
} from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);

  private readonly ordersEndpoint = `${API_BASE_URL}/orders`;
  private readonly adminOrdersEndpoint = `${API_BASE_URL}/admin/orders`;

  createOrder(payload: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.ordersEndpoint, payload);
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersEndpoint}/me`);
  }

  getAdminOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.adminOrdersEndpoint);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(
      `${this.adminOrdersEndpoint}/${orderId}/status`,
      { status } satisfies UpdateOrderStatusRequest,
    );
  }
}
