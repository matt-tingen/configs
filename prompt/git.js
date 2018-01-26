const exec = require('./exec');

const git = (...commandParts) => exec(['git', ...commandParts].join(' '));

module.exports = git;
