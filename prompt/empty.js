const color = require('./color');

const empty = ({ branch: { empty } }) => empty && color('yellow')('empty');

module.exports = empty;
