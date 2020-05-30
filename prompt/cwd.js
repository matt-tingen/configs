const os = require('os');
const path = require('path');
const color = require('./color');
const git = require('./git');

const HOME_DIR = os.homedir();

const formatter = (dir) => {
  const parts = dir.split(' ');

  return parts.map(color('cyan')).join(color('gray')('_'));
};

const replaceUserDir = (dir) =>
  dir.startsWith(HOME_DIR) ? dir.replace(HOME_DIR, '~') : dir;

const abbreviate = (dir, altRoot) => {
  if (!altRoot) {
    return null;
  }

  const relative = path.relative(altRoot, dir);
  const isSubDir = !relative.startsWith('..') && !path.isAbsolute(relative);
  return isSubDir ? relative : null;
};

const getGitRoot = async () => {
  try {
    const root = await git('root');
    return root && path.relative(root, '..');
  } catch {}
  return null;
};

const cwd = async () => {
  const cwd = process.cwd();

  const abbreviated =
    abbreviate(cwd, process.env.PROMPT_CWD_ALT_ROOT) ||
    abbreviate(cwd, await getGitRoot()) ||
    replaceUserDir(cwd);

  return formatter(abbreviated);
};

module.exports = cwd;
