const git = require('./git');
const color = require('./color');

// https://git-scm.com/docs/git-status#_branch_headers
const parseStatus = message => {
  const entries = message.split('\n').filter(line => line.startsWith('#'));

  if (entries.length === 3) {
    // TODO: What causes this? What should be displayed?
    throw new Error('upstream is set, but commit is not present');
  }

  if (entries.length <= 2) {
    return null; // No upstream
  }

  const abMatch = /branch\.ab \+(\d+) -(\d+)/.exec(entries[3]);

  return {
    ahead: parseInt(abMatch[1]),
    behind: parseInt(abMatch[2]),
  };
};

const format = ({ ahead, behind }) => {
  return [
    ahead && color('green')(`+${ahead}`),
    behind && color('red')(`-${behind}`),
  ]
    .filter(Boolean)
    .join(' ');
};

const upstream = ({ branch }) => {
  const result = branch.upstream ? format(branch) : color('yellow')('local');
  return result;
};

module.exports = upstream;
