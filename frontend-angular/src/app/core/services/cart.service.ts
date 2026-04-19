import { Injectable, computed, signal } from '@angular/core';

import { CART_STORAGE_KEY } from '../constants/api.constants';
import { CartItem } from '../models/cart.models';
import { ProductResponse } from '../models/menu.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.readStoredCart());

  readonly items = computed(() => this.itemsSignal());
  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((accumulator, item) => accumulator + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce((accumulator, item) => accumulator + item.quantity * item.price, 0),
  );

  addProduct(product: ProductResponse, quantity = 1): void {
    const normalizedQuantity = quantity > 0 ? quantity : 1;
    const updatedCart = [...this.itemsSignal()];
    const existingItem = updatedCart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += normalizedQuantity;
    } else {
      updatedCart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: normalizedQuantity,
      });
    }

    this.persist(updatedCart);
  }

  removeSingle(productId: number): void {
    const updatedCart = this.itemsSignal()
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    this.persist(updatedCart);
  }

  clear(): void {
    this.persist([]);
  }

  private persist(cart: CartItem[]): void {
    this.itemsSignal.set(cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  private readStoredCart(): CartItem[] {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item) =>
          typeof item.productId === 'number' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      );
    } catch {
      return [];
    }
  }
}
