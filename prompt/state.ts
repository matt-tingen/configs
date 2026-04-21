import color from './color.ts';
import presentParticiple from './presentParticiple.ts';
import type { GitStatus } from './types.ts';

const state = ({ state }: GitStatus): string =>
  state ? color('white', true)(presentParticiple(state)) : '';

export default state;
