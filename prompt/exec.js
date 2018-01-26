const { promisify } = require('util');
const _exec = promisify(require('child_process').exec);

const exec = (command, trim = true) => {
  const maybeTrim = result => (trim ? result.trim() : result);
  return _exec(command)
    .then(({ stdout }) => maybeTrim(stdout))
    .catch(({ stderr }) => {
      throw maybeTrim(stderr);
    });
};

module.exports = exec;
