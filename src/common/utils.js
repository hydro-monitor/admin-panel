export const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
