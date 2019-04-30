const exec = require('./exec');
const memoize = require('./memoize');

const git = memoize(command => exec(`git ${command}`));

module.exports = git;
