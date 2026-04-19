export type DeliveryType = 'RETIRADA' | 'ENTREGA';
export type PaymentMethod = 'PIX' | 'CARTAO_CREDITO' | 'DINHEIRO';
export type OrderStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  needChange: boolean;
  changeValue?: number | null;
  customerName: string;
  phone: string;
  address?: string;
  houseNumber?: string;
  complement?: string;
  neighborhood?: string;
  orderNote?: string;
  items: CreateOrderItemRequest[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  phone: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  needChange: boolean;
  changeValue?: number | null;
  address?: string | null;
  houseNumber?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  orderNote?: string | null;
  totalPrice: number;
  totalItems: number;
  items: OrderItemResponse[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
