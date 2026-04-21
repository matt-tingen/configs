import os from 'node:os';
import path from 'node:path';
import color from './color.ts';
import git from './git.ts';

const HOME_DIR = os.homedir();

const formatter = (dir: string): string => {
  const parts = dir.split(' ');

  return parts.map((p) => color('cyan')(p)).join(color('gray')('_'));
};

const replaceUserDir = (dir: string): string =>
  dir.startsWith(HOME_DIR) ? dir.replace(HOME_DIR, '~') : dir;

const abbreviate = (dir: string, altRoot: string | undefined): string | null => {
  if (!altRoot) {
    return null;
  }

  const relative = path.relative(altRoot, dir);
  const isSubDir = !relative.startsWith('..') && !path.isAbsolute(relative);
  return isSubDir ? relative : null;
};

const getGitRoot = async (): Promise<string | null> => {
  try {
    const root = await git('root');
    return root ? path.resolve(root, '..') : null;
  } catch {
    return null;
  }
};

const cwd = async (): Promise<string> => {
  const current = process.cwd();

  const abbreviated =
    abbreviate(current, process.env.PROMPT_CWD_ALT_ROOT) ??
    abbreviate(current, (await getGitRoot()) ?? undefined) ??
    replaceUserDir(current);

  return formatter(abbreviated);
};

export default cwd;
