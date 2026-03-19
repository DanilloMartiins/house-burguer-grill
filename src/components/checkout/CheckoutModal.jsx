export function CheckoutModal({ form, isOpen, onClose, onChange, onSubmit }) {
  const isDelivery = form.deliveryType === 'Entrega';
  const isCash = form.paymentMethod === 'Dinheiro';

  return (
    <div
      className={`checkout-modal${isOpen ? ' active' : ''}`}
      aria-hidden={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="checkout-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <button
          className="modal-close-btn"
          type="button"
          aria-label="Fechar popup"
          onClick={onClose}
        >
          X
        </button>

        <h3 id="checkout-title">Finalizar pedido</h3>

        <form className="checkout-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label>
              Nome:
              <input type="text" name="name" value={form.name} onChange={onChange} required />
            </label>

            <label hidden={!isDelivery}>
              Endereço:
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={onChange}
                required={isDelivery}
              />
            </label>

            <label hidden={!isDelivery}>
              Número da casa:
              <input
                type="text"
                name="houseNumber"
                value={form.houseNumber}
                onChange={onChange}
                required={isDelivery}
              />
            </label>

            <label hidden={!isDelivery}>
              Complemento:
              <input type="text" name="complement" value={form.complement} onChange={onChange} />
            </label>

            <label hidden={!isDelivery}>
              Bairro:
              <input
                type="text"
                name="neighborhood"
                value={form.neighborhood}
                onChange={onChange}
                required={isDelivery}
              />
            </label>

            <label>
              Telefone:
              <input type="tel" name="phone" value={form.phone} onChange={onChange} required />
            </label>
          </div>

          <fieldset className="form-fieldset">
            <legend>Pedido será:</legend>
            <label className="radio-line">
              <input
                type="radio"
                name="deliveryType"
                value="Retirada"
                checked={form.deliveryType === 'Retirada'}
                onChange={onChange}
              />
              Retirada
            </label>
            <label className="radio-line">
              <input
                type="radio"
                name="deliveryType"
                value="Entrega"
                checked={form.deliveryType === 'Entrega'}
                onChange={onChange}
              />
              Entrega
            </label>
          </fieldset>

          <div className="delivery-observation" hidden={!isDelivery}>
            Entregas serão acertadas com o entregador.
          </div>

          <div id="payment-section" hidden={!isDelivery}>
            <fieldset className="form-fieldset">
              <legend>Forma de pagamento:</legend>
              <label className="radio-line">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PIX"
                  checked={form.paymentMethod === 'PIX'}
                  onChange={onChange}
                />
                PIX
              </label>
              <label className="radio-line">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cartão de crédito"
                  checked={form.paymentMethod === 'Cartão de crédito'}
                  onChange={onChange}
                />
                Cartão de crédito
              </label>
              <label className="radio-line">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Dinheiro"
                  checked={form.paymentMethod === 'Dinheiro'}
                  onChange={onChange}
                />
                Dinheiro
              </label>
            </fieldset>

            <div className="cash-change-box" hidden={!isCash}>
              <p>
                <strong>Necessário troco?</strong>
              </p>
              <label className="radio-line">
                <input
                  type="checkbox"
                  name="needChange"
                  checked={form.needChange}
                  onChange={onChange}
                />
                Sim, preciso de troco
              </label>
              <label>
                Troco para quanto:
                <input
                  type="number"
                  name="changeValue"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 50,00"
                  value={form.changeValue}
                  onChange={onChange}
                  disabled={!form.needChange}
                  required={form.needChange}
                />
              </label>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit">
              Enviar pedido no WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
