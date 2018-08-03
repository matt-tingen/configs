const color = require('./color');

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
