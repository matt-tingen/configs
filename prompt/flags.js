const git = require('./git');
const color = require('./color');
const count = require('./count');

const flagColors = {
  M: 'yellow', // Modified
  A: 'green', // Added
  C: 'green', // Copied
  R: 'green', // Renamed
  D: 'red', // Deleted
  U: 'purple', // Updated but unmerged
  '!': 'purple', // Ignored
};

const formatChanges = changes => {
  const counts = count(changes.filter(Boolean));

  const components = Object.entries(counts).map(([flag, count]) =>
    color(flagColors[flag])(count + flag),
  );

  return components.join(' ');
};

const getWorkTreeFlag = ({ y: flag }) => (flag === '?' ? 'A' : flag);
const getIndexFlag = ({ x: flag }) => (flag === '?' ? null : flag);

const flags = ({ changes }) => {
  const workTreeFlags = formatChanges(changes.map(getWorkTreeFlag));
  const indexFlags = formatChanges(changes.map(getIndexFlag));
  const showSeparator = !!indexFlags;

  return workTreeFlags + (showSeparator ? color('gray')('|') : '') + indexFlags;
};

module.exports = flags;
