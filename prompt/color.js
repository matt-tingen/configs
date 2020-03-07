// https://unix.stackexchange.com/questions/124407/what-color-codes-can-i-use-in-my-ps1-prompt/124409#124409
const colorMap = {
  purple: 'magenta',
  gray: '008',
};

const RESET = '%f%b';
const escapeSequence = (color, bold) => `%{%F{${color}}%}${bold ? '%B' : ''}`;

const format = (color, bold) => text => {
  if (!text) {
    return '';
  }

  const colorValue = colorMap[color] || color;

  const prefix = escapeSequence(colorValue, bold);
  return prefix + text + RESET;
};

module.exports = format;
