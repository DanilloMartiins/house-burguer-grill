export function getStoredCheckoutForm(storageKey, initialForm) {
  if (typeof window === 'undefined') {
    return initialForm;
  }

  try {
    const storedForm = window.localStorage.getItem(storageKey);
    if (!storedForm) {
      return initialForm;
    }

    const parsedForm = JSON.parse(storedForm);

    return sanitizeCheckoutForm({
      ...initialForm,
      ...parsedForm,
    });
  } catch (error) {
    console.error('Não foi possível carregar os dados do cliente.', error);
    return initialForm;
  }
}

export function persistCheckoutForm(storageKey, form) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const sanitizedForm = sanitizeCheckoutForm(form);
    window.localStorage.setItem(storageKey, JSON.stringify(sanitizedForm));
  } catch (error) {
    console.error('Não foi possível salvar os dados do cliente.', error);
  }
}

export function updateCheckoutForm(currentForm, input) {
  const { name, type, value, checked } = input;
  const nextForm = {
    ...currentForm,
    [name]: type === 'checkbox' ? checked : value,
  };

  if (name === 'deliveryType' && value === 'Retirada') {
    nextForm.address = '';
    nextForm.houseNumber = '';
    nextForm.complement = '';
    nextForm.neighborhood = '';
    nextForm.needChange = false;
    nextForm.changeValue = '';
  }

  if (name === 'paymentMethod' && value !== 'Dinheiro') {
    nextForm.needChange = false;
    nextForm.changeValue = '';
  }

  if (name === 'needChange' && !checked) {
    nextForm.changeValue = '';
  }

  return nextForm;
}

function sanitizeCheckoutForm(form) {
  const sanitizedForm = {
    ...form,
    deliveryType: form.deliveryType === 'Entrega' ? 'Entrega' : 'Retirada',
    paymentMethod: getPaymentMethod(form.paymentMethod),
    needChange: Boolean(form.needChange),
    changeValue: form.needChange ? form.changeValue ?? '' : '',
  };

  if (sanitizedForm.deliveryType !== 'Entrega') {
    sanitizedForm.address = '';
    sanitizedForm.houseNumber = '';
    sanitizedForm.complement = '';
    sanitizedForm.neighborhood = '';
    sanitizedForm.paymentMethod = 'PIX';
    sanitizedForm.needChange = false;
    sanitizedForm.changeValue = '';
  }

  if (sanitizedForm.paymentMethod !== 'Dinheiro') {
    sanitizedForm.needChange = false;
    sanitizedForm.changeValue = '';
  }

  return sanitizedForm;
}

function getPaymentMethod(value) {
  if (value === 'Cartão de crédito' || value === 'Dinheiro') {
    return value;
  }

  return 'PIX';
}
