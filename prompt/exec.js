const { promisify } = require('util');
const _exec = promisify(require('child_process').exec);

const MAX_BUFFER = 512 * 1024; // 512kB

const exec = (command, trim = true) => {
  const maybeTrim = result => (trim ? result.trim() : result);
  return _exec(command, { maxBuffer: MAX_BUFFER })
    .then(({ stdout }) => maybeTrim(stdout))
    .catch(({ stderr }) => {
      throw maybeTrim(stderr);
    });
};

module.exports = exec;
