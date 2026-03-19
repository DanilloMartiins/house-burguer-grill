export const APP_CONFIG = Object.freeze({
  contact: {
    whatsappNumber: '5581989543788',
    phoneNumber: '+5581989543788',
    phoneLabel: '(81) 98954-3788',
  },
  storage: {
    cartKey: 'house-burguer-grill-cart-v1',
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
