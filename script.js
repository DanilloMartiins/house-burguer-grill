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
const clearCartButton = document.getElementById("clear-cart");

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

// =========================
// Modal de checkout
// =========================
function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Adicione pelo menos 1 item no carrinho antes de concluir o pedido.");
    return;
  }

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

  lines.push("Ola! Quero concluir este pedido:");
  lines.push("");

  for (const item of cart) {
    const subTotal = item.price * item.quantity;
    lines.push(`- ${item.name} x${item.quantity} (${formatCurrency(subTotal)})`);
  }

  lines.push("");
  lines.push(`Total do pedido: ${formatCurrency(totalPrice)}`);
  lines.push("");
  lines.push(`Nome: ${orderData.name}`);
  lines.push(`Telefone: ${orderData.phone}`);
  lines.push(`Tipo de pedido: ${orderData.deliveryType}`);

  if (orderData.deliveryType === "Entrega") {
    lines.push(`Endereco: ${orderData.address}`);
    lines.push(`Numero da casa: ${orderData.houseNumber}`);
    lines.push(`Complemento: ${orderData.complement || "Nao informado"}`);
    lines.push(`Bairro: ${orderData.neighborhood}`);

    lines.push(`Pagamento: ${orderData.paymentMethod}`);

    if (orderData.paymentMethod === "Dinheiro") {
      if (orderData.needChange) {
        lines.push(`Necessario troco: Sim (troco para ${formatCurrency(orderData.changeValue)})`);
      } else {
        lines.push("Necessario troco: Nao");
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

  const { totalItems, totalPrice } = getCartTotals();
  cartCountElement.textContent = String(totalItems);
  cartTotalElement.textContent = formatCurrency(totalPrice);
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

clearCartButton.addEventListener("click", clearCart);

openCheckoutButton.addEventListener("click", openCheckoutModal);
closeCheckoutButton.addEventListener("click", closeCheckoutModal);
cancelCheckoutButton.addEventListener("click", closeCheckoutModal);

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
