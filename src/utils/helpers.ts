export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

export const calculateDailyTarget = (targetAmount: number, targetDateStr: string): number => {
  const today = new Date();
  const target = new Date(targetDateStr);
  const diffTime = Math.max(target.getTime() - today.getTime(), 0);
  const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  return Math.ceil(targetAmount / diffDays);
};