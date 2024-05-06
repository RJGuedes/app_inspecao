const strip = (cnpj) => (cnpj || '').toString().replace(/[^\d]/g, '');

const digit = (numbers) => {
  let index = 2;

  const reverse = numbers
    .split('')
    .reduce((buffer, number) => [+number].concat(buffer), []);

  const sum = reverse.reduce((buffer, number) => {
    buffer += number * index;
    index = index === 9 ? 2 : index + 1;
    return buffer;
  }, 0);

  const mod = sum % 11;

  return mod < 2 ? 0 : 11 - mod;
};

/**
 * Formats a CNPJ value
 * @param {String|Number} cnpj The CNPJ to be formatted
 * @return {String} The formatted CNPJ
 */

const format = (cnpj) =>
  strip(cnpj).replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );

export const cnpjGenerate = () => {
  let cnpj = '';
  let i = 12;
  while (i--) {
    cnpj += Math.floor(Math.random() * 9);
  }
  cnpj += digit(cnpj);
  cnpj += digit(cnpj);
  cnpj = format(cnpj);
  return cnpj;
};
