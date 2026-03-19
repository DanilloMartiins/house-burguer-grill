import { formatCurrency } from '../../utils/currency.js';

export function FloatingCartButton({ totalItems, totalPrice, onOpenCart }) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <button className="floating-cart-button" type="button" onClick={onOpenCart}>
      <span className="floating-cart-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M3 4h2l2 10h10l2-7H7"></path>
          <circle cx="10" cy="19" r="1.5"></circle>
          <circle cx="17" cy="19" r="1.5"></circle>
        </svg>
      </span>
      <span className="floating-cart-copy">
        <strong>
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </strong>
        <span>{formatCurrency(totalPrice)}</span>
      </span>
      <span className="floating-cart-cta">Abrir carrinho</span>
    </button>
  );
}
