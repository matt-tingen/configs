import color from './color.ts';
import truncate from './truncate.ts';
import type { GitStatus } from './types.ts';

const formatNotes = (notes: string): string =>
  color('gray')('“' + truncate(notes, 30) + '”');

const branch = ({
  branch: { name, hash },
  tag: { isTagged, description },
  notes,
}: GitStatus): string => {
  if (name) {
    return color('blue')(name);
  }

  if (isTagged) {
    return color('yellow')(description);
  }

  return color('yellow')(hash) + (notes ? ' ' + formatNotes(notes) : '');
};

export default branch;
