// Format INR currency
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with Indian comma system
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}
