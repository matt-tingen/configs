// https://unix.stackexchange.com/questions/124407/what-color-codes-can-i-use-in-my-ps1-prompt/124409#124409
const colorMap: Record<string, string> = {
  purple: 'magenta',
  gray: '008',
};

const RESET = '%f%b';
const escapeSequence = (color: string, bold: boolean): string =>
  `%{%F{${color}}%}${bold ? '%B' : ''}`;

const format =
  (color: string, bold = false) =>
  (text: string | number | false | null | undefined): string => {
    if (!text) {
      return '';
    }

    const colorValue = colorMap[color] ?? color;

    const prefix = escapeSequence(colorValue, bold);
    return prefix + text + RESET;
  };

export default format;
