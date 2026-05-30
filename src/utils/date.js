export const formatMonth = (value) => {
  if (!value) return '';
  if (/^\d{4}$/.test(value)) return value;
  const [year, month] = value.split('-');
  const date = new Date(Number(year), Number(month || 1) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

export const dateRange = (start, end, current = false) => [formatMonth(start), current ? 'Present' : formatMonth(end)].filter(Boolean).join(' – ');
