import fs from 'node:fs/promises';
import path from 'node:path';
import color from './color.ts';
import exec from './exec.ts';
import git from './git.ts';

const lockfileStatus = async (): Promise<string | null> => {
  let root: string;

  try {
    root = await git('root');
    await fs.access(path.join(root, 'pnpm-lock.yaml'));
  } catch {
    return null;
  }

  try {
    await exec(`sha256sum -c '${path.join(root, 'pnpm-lock.yaml.sha256')}'`);
  } catch (error) {
    if (typeof error === 'string' && error.includes('did NOT match'))
      return color('red')('×pi ');
  }

  return null;
};

export default lockfileStatus;
