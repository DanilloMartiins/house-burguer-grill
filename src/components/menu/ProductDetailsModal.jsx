import { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/currency.js';
import { FoodIllustration } from './FoodIllustration.jsx';

export function ProductDetailsModal({
  item,
  isAdded,
  isOrderingOpen,
  onClose,
  onAddToCart,
  storeStatus,
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  if (!item) {
    return null;
  }

  const totalPrice = item.price * quantity;

  return (
    <div
      className="product-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        <button
          className="product-modal-close"
          type="button"
          aria-label="Fechar detalhes do produto"
          onClick={onClose}
        >
          X
        </button>

        <div className="product-modal-hero">
          <FoodIllustration item={item} />
          <div className="product-modal-copy">
            <p className="product-modal-tag">{item.tag}</p>
            <h3 id="product-title">{item.name}</h3>
            <p className="product-modal-description">{item.pitch}</p>
            <div className="product-modal-price-row">
              <strong>{formatCurrency(item.price)}</strong>
              <span>Preparado na hora</span>
            </div>
          </div>
        </div>

        <div className="product-modal-body">
          <div className="product-detail-card">
            <p className="product-detail-label">O que vem nele</p>
            <p>{item.description}</p>
          </div>

          <div className="product-detail-card">
            <p className="product-detail-label">Ingredientes em destaque</p>
            <div className="ingredient-chip-list">
              {item.ingredients.map((ingredient) => (
                <span className="ingredient-chip" key={ingredient}>
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="product-modal-actions">
          <div className="product-quantity-control" aria-label="Selecionar quantidade">
            <button
              className="product-quantity-btn"
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              -
            </button>
            <span className="product-quantity-value">{quantity}</span>
            <button
              className="product-quantity-btn"
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </button>
          </div>
          <button
            className={`btn btn-primary product-modal-cta${isAdded ? ' is-added' : ''}`}
            type="button"
            disabled={!isOrderingOpen}
            onClick={() => onAddToCart(item.name, item.price, quantity)}
          >
            {isOrderingOpen
              ? `${isAdded ? 'Adicionar mais' : 'Adicionar'} • ${formatCurrency(totalPrice)}`
              : 'Pedidos indisponíveis agora'}
          </button>
        </div>
        {!isOrderingOpen ? (
          <p className="product-modal-status-note">
            {storeStatus.statusLabel}. {storeStatus.detailLabel}.
          </p>
        ) : null}
      </section>
    </div>
  );
}
