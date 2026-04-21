import color from './color.ts';
import count from './count.ts';
import type { Change, GitStatus } from './types.ts';

const flagColors: Record<string, string> = {
  M: 'yellow', // Modified
  A: 'green', // Added
  C: 'green', // Copied
  R: 'green', // Renamed
  D: 'red', // Deleted
  U: 'purple', // Updated but unmerged
  '!': 'purple', // Ignored
};

const formatChanges = (changes: Array<string | null>): string => {
  const counts = count(changes.filter((c): c is string => Boolean(c)));

  const components = Object.entries(counts).map(([flag, n]) =>
    color(flagColors[flag] ?? 'white')(n + flag),
  );

  return components.join(' ');
};

const getWorkTreeFlag = ({ x: index, y: flag }: Change): string | null => {
  if (flag === '?') return 'A';
  if ([index, flag].includes('U')) return null;
  return flag;
};

const getIndexFlag = ({ x: flag, y: workTree }: Change): string | null => {
  if (flag === '?') return null;
  if (workTree === 'U') return 'U';
  return flag;
};

const flags = ({ changes }: GitStatus): string => {
  const workTreeFlags = formatChanges(changes.map(getWorkTreeFlag));
  const indexFlags = formatChanges(changes.map(getIndexFlag));
  const showSeparator = !!indexFlags;

  return workTreeFlags + (showSeparator ? color('gray')('|') : '') + indexFlags;
};

export default flags;
