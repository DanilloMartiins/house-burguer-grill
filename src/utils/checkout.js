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
