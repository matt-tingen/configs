import color from './color.ts';
import type { GitStatus } from './types.ts';

const empty = ({ branch: { empty } }: GitStatus): string =>
  empty ? color('yellow')('empty') : '';

export default empty;
