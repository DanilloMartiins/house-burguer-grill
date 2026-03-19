export const APP_CONFIG = Object.freeze({
  contact: {
    whatsappNumber: '5581989543788',
    phoneNumber: '+5581989543788',
    phoneLabel: '(81) 98954-3788',
  },
  business: {
    timeZone: 'America/Recife',
    openDays: [2, 3, 4, 5, 6, 0],
    openHour: 17,
    closeHour: 22,
    scheduleLabel: 'Ter, Qua, Qui, Sex, Sab e Dom • 17h às 22h',
  },
  storage: {
    cartKey: 'house-burguer-grill-cart-v1',
    checkoutKey: 'house-burguer-grill-checkout-v1',
    orderHistoryKey: 'house-burguer-grill-last-order-v1',
  },
});

export const INITIAL_CHECKOUT_FORM = Object.freeze({
  name: '',
  address: '',
  houseNumber: '',
  complement: '',
  neighborhood: '',
  phone: '',
  deliveryType: 'Retirada',
  paymentMethod: 'PIX',
  needChange: false,
  changeValue: '',
});
