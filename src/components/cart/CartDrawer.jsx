import { MENU_ITEMS_BY_NAME } from '../../data/menu.js';
import { formatCurrency } from '../../utils/currency.js';

export function CartDrawer({
  cart,
  isOrderingOpen,
  totalItems,
  totalPrice,
  orderNote,
  isOpen,
  onClose,
  onOrderNoteChange,
  onAddOne,
  onRemoveOne,
  onClearCart,
  onCheckout,
  storeStatus,
}) {
  return (
    <>
      <div className={`cart-backdrop${isOpen ? ' active' : ''}`} onClick={onClose}></div>

      <aside className={`cart-drawer${isOpen ? ' active' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-drawer-header">
          <h3>Seu carrinho</h3>
          <button
            className="drawer-close-btn"
            type="button"
            aria-label="Fechar carrinho"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <ul className="cart-items" aria-live="polite">
          {cart.length === 0 ? (
            <li className="empty-cart">Seu carrinho está vazio.</li>
          ) : (
            cart.map((item) => (
              <li className="cart-item cart-item-card" key={item.name}>
                <div className="cart-item-main">
                  <div className="cart-item-content">
                    {MENU_ITEMS_BY_NAME[item.name]?.image ? (
                      <img
                        className="cart-item-image"
                        src={MENU_ITEMS_BY_NAME[item.name].image}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : null}

                    <div>
                    <p className="cart-item-title">{item.name}</p>
                    <strong className="cart-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </strong>
                    </div>
                  </div>
                  <button
                    className="cart-item-delete"
                    type="button"
                    aria-label={`Remover ${item.name}`}
                    onClick={() => onRemoveOne(item.name)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16"></path>
                      <path d="M9 7V4h6v3"></path>
                      <path d="M8 10v7"></path>
                      <path d="M12 10v7"></path>
                      <path d="M16 10v7"></path>
                    </svg>
                  </button>
                </div>

                <div className="cart-item-footer">
                  <span className="cart-item-unit">{formatCurrency(item.price)} cada</span>
                  <div className="cart-item-quantity">
                    <button type="button" onClick={() => onRemoveOne(item.name)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onAddOne(item.name, item.price)}>
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="order-note-box">
          <label htmlFor="order-note">Observações do pedido</label>
          <textarea
            id="order-note"
            maxLength="200"
            placeholder="Ex.: Sem cebola, dois sachês de maionese."
            value={orderNote}
            onChange={(event) => onOrderNoteChange(event.target.value)}
          ></textarea>
          <p className="order-note-counter">{orderNote.length}/200</p>
        </div>

        <div className="cart-summary">
          <p>Itens: {totalItems}</p>
          <p>Subtotal: {formatCurrency(totalPrice)}</p>
          <p>
            Total: <strong>{formatCurrency(totalPrice)}</strong>
          </p>
        </div>

        <div className="cart-actions">
          <button
            className="btn btn-primary"
            type="button"
            disabled={totalItems === 0 || !isOrderingOpen}
            onClick={onCheckout}
          >
            {isOrderingOpen ? 'Finalizar pedido' : 'Pedidos indisponíveis agora'}
          </button>
          <button
            className="btn btn-outline"
            type="button"
            disabled={totalItems === 0}
            onClick={onClearCart}
          >
            Limpar carrinho
          </button>
        </div>
        {!isOrderingOpen ? (
          <p className="cart-status-note">
            {storeStatus.statusLabel}. {storeStatus.detailLabel}.
          </p>
        ) : null}
      </aside>
    </>
  );
}
