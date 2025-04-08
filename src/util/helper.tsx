export const formatIDR = (value: string | number): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatEUR = (value: string | number): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatUSD = (value: string | number): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
