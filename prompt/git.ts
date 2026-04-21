import exec from './exec.ts';
import memoize from './memoize.ts';

const git = memoize((command: string) => exec(`git ${command}`));

export default git;
