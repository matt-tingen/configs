const git = require('./git');
const color = require('./color');
const count = require('./count');

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

const flags = ({ changes }) => {
  // Favor the flag for the index over the one for the work tree.
  const flags = changes.map(change => change.x || change.y);
  const counts = count(flags);

  const components = Object.entries(counts).map(([flag, count]) =>
    color(flagColors[flag])(count + flag)
  );

  return components.join(' ');
};

module.exports = flags;
