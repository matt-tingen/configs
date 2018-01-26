const git = require('./git');

const branch = () => git('rev-parse --abbrev-ref HEAD').catch(() => null);

module.exports = branch;
