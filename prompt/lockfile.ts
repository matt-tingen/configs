import path from 'node:path';
import color from './color.ts';
import exec from './exec.ts';
import git from './git.ts';

const sha256 = async (filepath: string): Promise<string> => {
  const output = await exec(`sha256sum '${filepath}'`);
  return output.split(' ')[0];
};

const lockfileStatus = async (): Promise<string | null> => {
  let root: string;
  let current: string;

  try {
    root = await git('root');
    current = await sha256(path.join(root, 'pnpm-lock.yaml'));
  } catch {
    return null;
  }

  try {
    const installed = await sha256(
      path.join(root, 'node_modules', '.pnpm', 'lock.yaml'),
    );
    if (current === installed) return null;
  } catch {
    // Missing installed lockfile → install needed.
  }

  return color('red')('×pi ');
};

export default lockfileStatus;
