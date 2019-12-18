const color = require('./color');
const truncate = require('./truncate');

const formatNotes = notes => color('gray')('“' + truncate(notes, 30) + '”');

const branch = ({
  branch: { name: branch, hash },
  tag: { isTagged, description },
  notes,
  state,
}) => {
  if (branch) {
    return color('blue')(branch);
  }

  if (isTagged) {
    return color('yellow')(description);
  }

  return color('yellow')(hash) + (notes ? ' ' + formatNotes(notes) : '');
};

module.exports = branch;
