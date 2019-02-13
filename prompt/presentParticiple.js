const presentParticiple = verb =>
  (verb.endsWith('e') ? verb.slice(0, -1) : verb) + 'ing';

module.exports = presentParticiple;
