export function sanitizeCart(rawCart) {
  if (!Array.isArray(rawCart)) {
    return [];
  }

  return rawCart.filter(
    (item) =>
      item &&
      typeof item.name === 'string' &&
      Number.isFinite(item.price) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
  );
}

export function getCartTotals(cart) {
  return cart.reduce(
    (totals, item) => ({
      totalItems: totals.totalItems + item.quantity,
      totalPrice: totals.totalPrice + item.quantity * item.price,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}

export function addItemToCart(cart, name, price, quantity = 1) {
  const normalizedQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    return cart.map((item) =>
      item.name === name ? { ...item, quantity: item.quantity + normalizedQuantity } : item
    );
  }

  return [...cart, { name, price, quantity: normalizedQuantity }];
}

export function removeSingleItemFromCart(cart, name) {
  return cart
    .map((item) => (item.name === name ? { ...item, quantity: item.quantity - 1 } : item))
    .filter((item) => item.quantity > 0);
}
