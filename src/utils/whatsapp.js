import { formatCurrency } from './currency.js';
import { getCartTotals } from './cart.js';

export function buildWhatsAppMessage(cart, orderNote, formData) {
  const { totalPrice } = getCartTotals(cart);
  const lines = [];

  lines.push(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push('');
  lines.push(`Cliente: ${formData.name}`);
  lines.push(`Telefone: ${formData.phone}`);
  lines.push('---------------------');
  lines.push('');

  for (const item of cart) {
    lines.push(item.name.toUpperCase());
    lines.push(
      `${item.quantity} UN x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}`
    );
    lines.push('');
  }

  lines.push('---------------------');
  lines.push(`SUBTOTAL: ${formatCurrency(totalPrice)}`);
  lines.push('');

  if (orderNote.trim()) {
    lines.push(`Observações: ${orderNote.trim()}`);
    lines.push('');
  }

  if (formData.deliveryType === 'Entrega') {
    const paymentLabel = formData.paymentMethod === 'PIX' ? 'Pix' : formData.paymentMethod;
    lines.push(`Pagamento: ${paymentLabel}`);
    lines.push('Entrega no endereço');
    lines.push(`Endereço: ${formData.address}, ${formData.houseNumber} - ${formData.neighborhood}`);
    lines.push(`Complemento: ${formData.complement || 'Não informado'}`);

    if (formData.paymentMethod === 'Dinheiro') {
      if (formData.needChange) {
        lines.push(`Troco: Sim, para ${formatCurrency(Number(formData.changeValue || 0))}`);
      } else {
        lines.push('Troco: Não');
      }
    }
  } else {
    lines.push('Pagamento: A combinar no local (retirada)');
  }

  return lines.join('\n');
}
