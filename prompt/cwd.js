const path = require('path');
const color = require('./color');
const git = require('./git');
const os = require('os');

const HOME_DIR = os.homedir();

const formatter = dir => {
  const parts = dir.split(' ');

  return parts.map(color('cyan')).join(color('gray')('_'));
};

const replaceUserDir = dir =>
  dir.startsWith(HOME_DIR) ? dir.replace(HOME_DIR, '~') : dir;

const cwd = async () => {
  const cwd = process.cwd();

  try {
    const gitRoot = await git('root');
    // Show the git root and any lower directories.
    const abbreviated = path.relative(path.resolve(gitRoot, '..'), cwd);

    return formatter(abbreviated);
  } catch (ignore) {}

  return formatter(replaceUserDir(cwd));
};

module.exports = cwd;
