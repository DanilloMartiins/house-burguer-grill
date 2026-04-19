export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
}
