const path = require('path');
const color = require('./color');
const git = require('./git');
const os = require('os');

const formatter = dir => {
  const parts = dir.split(' ');

  return parts.map(color('cyan')).join(color('gray')('_'));
};

const replaceUserDir = dir => dir.replace(os.homedir(), '~');

const cwd = async abbreviate => {
  const cwd = process.cwd();

  if (!abbreviate) {
    return formatter(replaceUserDir(cwd));
  }

  const gitRoot = await git('root');
  // Show the git root and any lower directories.
  const abbreviated = path.relative(path.resolve(gitRoot, '..'), cwd);

  return formatter(abbreviated);
};

module.exports = cwd;
