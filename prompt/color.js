const colorValues = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  purple: 35,
  cyan: 36,
  white: 37,
  gray: 90,
};

const RESET = '\\[\\e[00m\\]';
const escapeSequence = (color, bold) => `\\[\\e[${bold ? 1 : 0};${color}m\\]`;

const format = (color, bold) => text => {
  if (!text) {
    return '';
  }

  const colorValue = colorValues[color];

  if (!colorValue) {
    return text;
  }

  const prefix = escapeSequence(colorValue, bold);
  return prefix + text + RESET;
};

module.exports = format;
