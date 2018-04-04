const _ = require('lodash');
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

  // Favor the flag for the index over the one for the work tree.
  const flags = entries.map(entry => entry.x || entry.y);
  const counts = _.countBy(flags);

  const components = Object.entries(counts).map(([flag, count]) =>
    color(flagColors[flag])(count + flag)
  );

  return components.join(' ');
};

module.exports = flags;
