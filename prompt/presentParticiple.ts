const presentParticiple = (verb: string): string =>
  (verb.endsWith('e') ? verb.slice(0, -1) : verb) + 'ing';

export default presentParticiple;
