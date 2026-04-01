const exec = require('./exec');
const color = require('./color');
const git = require('./git');
const fs = require('fs/promises');
const path = require('path');

const lockfileStatus = async () => {
  let root;

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

module.exports = lockfileStatus;
