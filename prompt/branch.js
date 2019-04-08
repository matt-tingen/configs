const color = require('./color');
const truncate = require('./truncate');

const formatNotes = notes => color('gray')('“' + truncate(notes, 20) + '”');

const branch = ({
  branch: { name: branch },
  tag: { isTagged, description },
  notes,
}) => {
  if (branch) {
    return color('blue')(branch);
  }

  if (isTagged) {
    return color('yellow')(description);
  }

  return color('red')(description) + (notes ? ' ' + formatNotes(notes) : '');
};

module.exports = branch;
