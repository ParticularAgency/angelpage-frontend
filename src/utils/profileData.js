export const ensureArray = value => (Array.isArray(value) ? value : []);

export const normalizePaymentMethod = payment => ({
  ...payment,
  billingAddress:
    payment?.billingAddress &&
    typeof payment.billingAddress === 'object' &&
    !Array.isArray(payment.billingAddress)
      ? payment.billingAddress
      : {
          name: '',
          address: '',
          city: '',
          country: '',
          postCode: '',
        },
});

export const normalizeAddress = address =>
  address && typeof address === 'object' && !Array.isArray(address)
    ? address
    : null;
