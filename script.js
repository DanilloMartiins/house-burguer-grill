// =========================
// Configuracao principal
// =========================
const WHATSAPP_NUMBER = "5581989543788";

// Lista de itens do carrinho.
// Cada item: { name: string, price: number, quantity: number }
const cart = [];

// =========================
// Referencias do HTML
// =========================
const addButtons = document.querySelectorAll(".btn-add");
const cartItemsElement = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");
const cartCountBadgeElement = document.getElementById("cart-count-badge");
const clearCartButton = document.getElementById("clear-cart");
const cartDrawer = document.getElementById("pedidos");
const cartBackdrop = document.getElementById("cart-backdrop");
const toggleCartButton = document.getElementById("toggle-cart");
const openCartFromNavButton = document.getElementById("open-cart-from-nav");
const closeCartButton = document.getElementById("close-cart");

const openCheckoutButton = document.getElementById("open-checkout");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutButton = document.getElementById("close-checkout");
const cancelCheckoutButton = document.getElementById("cancel-checkout");
const checkoutForm = document.getElementById("checkout-form");

const customerNameInput = document.getElementById("customer-name");
const customerAddressInput = document.getElementById("customer-address");
const customerHouseNumberInput = document.getElementById("customer-house-number");
const customerComplementInput = document.getElementById("customer-complement");
const customerNeighborhoodInput = document.getElementById("customer-neighborhood");
const customerPhoneInput = document.getElementById("customer-phone");

const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
const deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
const deliveryFields = document.querySelectorAll(".delivery-field");
const paymentSection = document.getElementById("payment-section");
const cashChangeBox = document.getElementById("cash-change-box");
const needChangeCheckbox = document.getElementById("need-change");
const changeValueInput = document.getElementById("change-value");

// =========================
// Funcoes auxiliares
// =========================
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function findItemIndex(itemName) {
  return cart.findIndex((item) => item.name === itemName);
}

function getCartTotals() {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of cart) {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  }

  return { totalItems, totalPrice };
}

function getSelectedValue(name) {
  const checkedInput = document.querySelector(`input[name="${name}"]:checked`);
  return checkedInput ? checkedInput.value : "";
}

// =========================
// Regras do carrinho
// =========================
function addToCart(itemName, itemPrice) {
  const itemIndex = findItemIndex(itemName);

  if (itemIndex >= 0) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({
      name: itemName,
      price: itemPrice,
      quantity: 1,
    });
  }

  renderCart();
}

function removeOneFromCart(itemName) {
  const itemIndex = findItemIndex(itemName);

  if (itemIndex === -1) {
    return;
  }

  cart[itemIndex].quantity -= 1;

  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

function clearCart() {
  cart.length = 0;
  renderCart();
}

function openCartDrawer() {
  if (!cartDrawer || !cartBackdrop) {
    return;
  }
  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartBackdrop.classList.add("active");
}

function closeCartDrawer() {
  if (!cartDrawer || !cartBackdrop) {
    return;
  }
  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartBackdrop.classList.remove("active");
}

// =========================
// Modal de checkout
// =========================
function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Adicione pelo menos 1 item no carrinho antes de concluir o pedido.");
    return;
  }

  closeCartDrawer();
  updateCheckoutByDelivery();
  checkoutModal.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateCheckoutByDelivery() {
  const deliveryType = getSelectedValue("delivery-type");
  const isDelivery = deliveryType === "Entrega";

  for (const field of deliveryFields) {
    field.hidden = !isDelivery;
  }

  paymentSection.hidden = !isDelivery;
  customerAddressInput.required = isDelivery;
  customerHouseNumberInput.required = isDelivery;
  customerNeighborhoodInput.required = isDelivery;

  if (!isDelivery) {
    customerAddressInput.value = "";
    customerHouseNumberInput.value = "";
    customerComplementInput.value = "";
    customerNeighborhoodInput.value = "";

    needChangeCheckbox.checked = false;
    changeValueInput.value = "";
    changeValueInput.disabled = true;
    changeValueInput.required = false;
    cashChangeBox.hidden = true;
    return;
  }

  updateCashChangeBox();
}

function updateCashChangeBox() {
  if (paymentSection.hidden) {
    cashChangeBox.hidden = true;
    return;
  }

  const paymentMethod = getSelectedValue("payment-method");
  const isCash = paymentMethod === "Dinheiro";

  cashChangeBox.hidden = !isCash;

  if (!isCash) {
    needChangeCheckbox.checked = false;
    changeValueInput.value = "";
    changeValueInput.disabled = true;
    changeValueInput.required = false;
  }
}

function updateChangeInputState() {
  const shouldEnable = needChangeCheckbox.checked;
  changeValueInput.disabled = !shouldEnable;
  changeValueInput.required = shouldEnable;

  if (!shouldEnable) {
    changeValueInput.value = "";
  }
}

// =========================
// WhatsApp
// =========================
function buildWhatsAppMessage(orderData) {
  const { totalPrice } = getCartTotals();
  const lines = [];
  const currentDate = new Date().toLocaleDateString("pt-BR");

  lines.push(`Data: ${currentDate}`);
  lines.push("");
  lines.push(`Cliente: ${orderData.name}`);
  lines.push(`Telefone: ${orderData.phone}`);
  lines.push("---------------------");
  lines.push("");

  for (const item of cart) {
    const unitValue = formatCurrency(item.price);
    const subTotal = formatCurrency(item.price * item.quantity);
    lines.push(item.name.toUpperCase());
    lines.push(`${item.quantity} UN x ${unitValue} = ${subTotal}`);
    lines.push("");
  }

  lines.push("---------------------");
  lines.push(`SUBTOTAL: ${formatCurrency(totalPrice)}`);
  lines.push("");

  if (orderData.deliveryType === "Entrega") {
    let paymentText = orderData.paymentMethod;
    if (orderData.paymentMethod === "PIX") {
      paymentText = "Pix";
    }
    lines.push(`Pagamento: ${paymentText}`);
    lines.push("Entrega no endereco");
    lines.push(`Endereco: ${orderData.address}, ${orderData.houseNumber} - ${orderData.neighborhood}`);
    lines.push(`Complemento: ${orderData.complement || "Nao informado"}`);

    if (orderData.paymentMethod === "Dinheiro") {
      if (orderData.needChange) {
        lines.push(`Troco: Sim, para ${formatCurrency(orderData.changeValue)}`);
      } else {
        lines.push("Troco: Nao");
      }
    }
  } else {
    lines.push("Pagamento: A combinar no local (retirada)");
  }

  return lines.join("\n");
}

function sendOrderToWhatsApp(orderData) {
  const message = buildWhatsAppMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(url, "_blank");
}

// =========================
// Renderizacao
// =========================
function renderCart() {
  // Mantem compatibilidade caso exista lista de itens em outras versoes da pagina.
  if (cartItemsElement) {
    cartItemsElement.innerHTML = "";

    if (cart.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-cart";
      emptyItem.textContent = "Seu carrinho esta vazio.";
      cartItemsElement.appendChild(emptyItem);
    } else {
      for (const item of cart) {
        const listItem = document.createElement("li");
        listItem.className = "cart-item";

        const itemText = document.createElement("p");
        itemText.textContent = `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-outline";
        removeButton.textContent = "Remover 1";
        removeButton.addEventListener("click", () => {
          removeOneFromCart(item.name);
        });

        listItem.appendChild(itemText);
        listItem.appendChild(removeButton);
        cartItemsElement.appendChild(listItem);
      }
    }
  }

  const { totalItems, totalPrice } = getCartTotals();
  if (cartCountElement) {
    cartCountElement.textContent = String(totalItems);
  }
  if (cartCountBadgeElement) {
    cartCountBadgeElement.textContent = String(totalItems);
  }
  if (cartTotalElement) {
    cartTotalElement.textContent = formatCurrency(totalPrice);
  }
  if (openCheckoutButton) {
    openCheckoutButton.disabled = totalItems === 0;
  }
  if (clearCartButton) {
    clearCartButton.disabled = totalItems === 0;
  }
}

// =========================
// Eventos
// =========================
for (const button of addButtons) {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    addToCart(name, price);
  });
}

if (clearCartButton) {
  clearCartButton.addEventListener("click", clearCart);
}

if (toggleCartButton) {
  toggleCartButton.addEventListener("click", openCartDrawer);
}
if (openCartFromNavButton) {
  openCartFromNavButton.addEventListener("click", openCartDrawer);
}
if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCartDrawer);
}
if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCartDrawer);
}

if (openCheckoutButton) {
  openCheckoutButton.addEventListener("click", openCheckoutModal);
}
if (closeCheckoutButton) {
  closeCheckoutButton.addEventListener("click", closeCheckoutModal);
}
if (cancelCheckoutButton) {
  cancelCheckoutButton.addEventListener("click", closeCheckoutModal);
}

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    closeCheckoutModal();
  }
});

for (const radio of paymentRadios) {
  radio.addEventListener("change", updateCashChangeBox);
}

for (const radio of deliveryRadios) {
  radio.addEventListener("change", updateCheckoutByDelivery);
}

needChangeCheckbox.addEventListener("change", updateChangeInputState);

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  updateCheckoutByDelivery();
  updateCashChangeBox();
  updateChangeInputState();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  const orderData = {
    name: customerNameInput.value.trim(),
    address: customerAddressInput.value.trim(),
    houseNumber: customerHouseNumberInput.value.trim(),
    complement: customerComplementInput.value.trim(),
    neighborhood: customerNeighborhoodInput.value.trim(),
    phone: customerPhoneInput.value.trim(),
    deliveryType: getSelectedValue("delivery-type"),
    paymentMethod: getSelectedValue("payment-method"),
    needChange: needChangeCheckbox.checked,
    changeValue: Number(changeValueInput.value || 0),
  };

  sendOrderToWhatsApp(orderData);
  closeCheckoutModal();
});

// Estado inicial da pagina.
renderCart();
updateCheckoutByDelivery();
updateCashChangeBox();
updateChangeInputState();
