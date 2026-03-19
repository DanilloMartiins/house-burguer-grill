import { formatCurrency } from '../../utils/currency.js';

export function CheckoutModal({ form, isOpen, onClose, onChange, onSubmit, totalItems, totalPrice }) {
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

        <div className="checkout-modal-header">
          <h3 id="checkout-title">Confirme seu pedido</h3>
        </div>

        <div className="checkout-summary-strip">
          <div className="checkout-summary-pill">
            <span>Itens</span>
            <strong>{totalItems}</strong>
          </div>
          <div className="checkout-summary-pill">
            <span>Total</span>
            <strong>{formatCurrency(totalPrice)}</strong>
          </div>
          <div className="checkout-summary-pill">
            <span>Pedido</span>
            <strong>{isDelivery ? 'Entrega' : 'Retirada'}</strong>
          </div>
        </div>

        <form className="checkout-form" onSubmit={onSubmit}>
          <section className="checkout-section">
            <div className="checkout-section-head">
              <p className="checkout-step">1</p>
              <div>
                <h4>Como você vai receber</h4>
              </div>
            </div>

            <fieldset className="form-fieldset delivery-choice-fieldset">
              <legend>Pedido será:</legend>
              <div className="choice-grid">
                <label className={`choice-card${form.deliveryType === 'Retirada' ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="Retirada"
                    checked={form.deliveryType === 'Retirada'}
                    onChange={onChange}
                  />
                  <span>Retirada</span>
                  <small>Você busca no local</small>
                </label>
                <label className={`choice-card${form.deliveryType === 'Entrega' ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="Entrega"
                    checked={form.deliveryType === 'Entrega'}
                    onChange={onChange}
                  />
                  <span>Entrega</span>
                  <small>Recebe no endereço informado</small>
                </label>
              </div>
            </fieldset>

            <div className="delivery-observation" hidden={!isDelivery}>
              Entregas serão acertadas com o entregador.
            </div>
          </section>

          <section className="checkout-section" hidden={!isDelivery}>
            <div className="checkout-section-head">
              <p className="checkout-step">2</p>
              <div>
                <h4>Forma de pagamento</h4>
              </div>
            </div>

            <div id="payment-section" hidden={!isDelivery}>
              <fieldset className="form-fieldset">
                <legend>Forma de pagamento:</legend>
                <div className="choice-grid choice-grid--payment">
                  <label className={`choice-card${form.paymentMethod === 'PIX' ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PIX"
                      checked={form.paymentMethod === 'PIX'}
                      onChange={onChange}
                    />
                    <span>PIX</span>
                    <small>Pagamento rápido</small>
                  </label>
                  <label
                    className={`choice-card${form.paymentMethod === 'Cartão de crédito' ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cartão de crédito"
                      checked={form.paymentMethod === 'Cartão de crédito'}
                      onChange={onChange}
                    />
                    <span>Cartão</span>
                    <small>Crédito no recebimento</small>
                  </label>
                  <label className={`choice-card${form.paymentMethod === 'Dinheiro' ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Dinheiro"
                      checked={form.paymentMethod === 'Dinheiro'}
                      onChange={onChange}
                    />
                    <span>Dinheiro</span>
                    <small>Pagamento em espécie</small>
                  </label>
                </div>
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
                  Troco para quanto
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
          </section>

          <section className="checkout-section">
            <div className="checkout-section-head">
              <p className="checkout-step">{isDelivery ? '3' : '2'}</p>
              <div>
                <h4>Seus dados</h4>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Nome
                <input type="text" name="name" value={form.name} onChange={onChange} required />
              </label>

              <label>
                Telefone
                <input type="tel" name="phone" value={form.phone} onChange={onChange} required />
              </label>

              <label hidden={!isDelivery}>
                Endereço
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  required={isDelivery}
                />
              </label>

              <label hidden={!isDelivery}>
                Número da casa
                <input
                  type="text"
                  name="houseNumber"
                  value={form.houseNumber}
                  onChange={onChange}
                  required={isDelivery}
                />
              </label>

              <label hidden={!isDelivery}>
                Complemento
                <input type="text" name="complement" value={form.complement} onChange={onChange} />
              </label>

              <label hidden={!isDelivery}>
                Bairro
                <input
                  type="text"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={onChange}
                  required={isDelivery}
                />
              </label>
            </div>
          </section>

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
