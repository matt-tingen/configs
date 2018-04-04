const git = require('./git');
const color = require('./color');

const branch = ({ branch: { ref, detached } }) =>
  detached ? color('red')(ref.substr(0, 7)) : color('blue')(ref);

module.exports = branch;
