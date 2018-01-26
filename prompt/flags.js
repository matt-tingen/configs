const git = require('./git');
const color = require('./color');

const flagColors = {
  M: 'yellow',
  A: 'green',
  C: 'green',
  R: 'green',
  '?': 'green',
  D: 'red',
  U: 'purple',
  '!': 'purple',
};

// https://git-scm.com/docs/git-status#_short_format
const parseStatus = message => {
  if (!message) {
    return [];
  }

  const entries = message.split('\n');

  return entries.map(line => ({
    x: line[0].trim(),
    y: line[1].trim(),
  }));
};

const flags = async () => {
  const status = await git('status --porcelain');
  const entries = parseStatus(status);

  // Favor the flag from the index over the one for the work tree.
  const flags = new Set(entries.map(entry => entry.x || entry.y));
  const array = Array.from(flags.values());

  return array.map(char => color(flagColors[char])(char)).join('');
};

module.exports = flags;
