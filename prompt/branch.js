const color = require('./color');
const truncate = require('./truncate');

const formatNotes = notes => color('gray')('“' + truncate(notes, 20) + '”');

const branch = ({ branch: { ref, detached }, notes }) =>
  detached
    ? color('red')(ref.substr(0, 7)) + (notes ? ' ' + formatNotes(notes) : '')
    : color('blue')(ref);

module.exports = branch;
