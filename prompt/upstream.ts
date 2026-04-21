import color from './color.ts';
import type { BranchStatus, GitStatus } from './types.ts';

const format = ({ ahead, behind }: BranchStatus): string =>
  [
    ahead ? color('green')(`+${ahead}`) : '',
    behind ? color('red')(`-${behind}`) : '',
  ]
    .filter(Boolean)
    .join(' ');

const upstream = ({ branch }: GitStatus): string =>
  branch.upstream ? format(branch) : color('yellow')('local');

export default upstream;
