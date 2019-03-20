const path = require('path');
const color = require('./color');
const git = require('./git');

const formatter = color('cyan');

const cwd = async abbreviate => {
  if (!abbreviate) {
    return formatter('\\w');
  }

  const cwd = process.cwd();
  const gitRoot = await git('root');
  // Show the git root and any lower directories.
  const abbreviated = path.relative(path.resolve(gitRoot, '..'), cwd);

  return formatter(abbreviated);
};

module.exports = cwd;
