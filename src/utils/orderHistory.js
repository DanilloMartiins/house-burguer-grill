import { formatCurrency } from './currency.js';

export function getStoredLastOrder(storageKey, timeZone) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedOrder = window.localStorage.getItem(storageKey);
    if (!storedOrder) {
      return null;
    }

    const parsedOrder = JSON.parse(storedOrder);
    return formatLastOrder(parsedOrder, timeZone);
  } catch (error) {
    console.error('Não foi possível carregar o último pedido.', error);
    return null;
  }
}

export function persistLastOrder(storageKey, payload) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch (error) {
    console.error('Não foi possível salvar o último pedido.', error);
  }
}

function formatLastOrder(order, timeZone) {
  if (!order?.createdAt) {
    return null;
  }

  const date = new Date(order.createdAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return {
    ...order,
    items: Array.isArray(order.items) ? order.items.filter((item) => item?.name && item?.quantity) : [],
    orderNote: typeof order.orderNote === 'string' ? order.orderNote.trim() : '',
    formattedDate,
    formattedTotal: formatCurrency(Number(order.totalPrice || 0)),
  };
}
