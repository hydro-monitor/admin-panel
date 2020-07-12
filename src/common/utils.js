export const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const not = (a, b) => {
  return a.filter(value => b.indexOf(value) === -1);
};

export const intersection = (a, b) => {
  return a.filter(value => b.indexOf(value) !== -1);
};

export const union = (a, b) => {
  return [...a, ...not(b, a)];
};
