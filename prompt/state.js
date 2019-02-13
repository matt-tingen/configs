const color = require('./color');
const presentParticiple = require('./presentParticiple');

const state = ({ state }) =>
  state && color('white', true)(presentParticiple(state));

module.exports = state;
