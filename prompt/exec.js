const { promisify } = require('util');
const _exec = promisify(require('child_process').exec);

const MAX_BUFFER = 512 * 1024; // 512kB

const exec = async (command, trim = true) => {
  const maybeTrim = result => (trim ? result.trim() : result);

  try {
    const { stdout } = await _exec(command, { maxBuffer: MAX_BUFFER });

    return maybeTrim(stdout);
  } catch ({ stderr }) {
    throw maybeTrim(stderr);
  }
};

module.exports = exec;
