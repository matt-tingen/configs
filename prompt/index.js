const _ = require('lodash');

const color = require('./color');
const getBranch = require('./branch');
const getFlags = require('./flags');
// const getRemote = require('./remote');

const gitStatus = async () => {
  const branch = await getBranch();

  if (!branch) {
    return '';
  }

  const flags = await getFlags();
  // const remote = await getRemote();

  return [
    color('gray')(' ['),
    color('blue')(branch),
    flags && ` ${flags}`,
    // ` ${remote}`,
    color('gray')(']'),
  ];
};

const buildPrompt = async () => {
  const components = [
    color('cyan')('\\w'), // Working dir
    await gitStatus(),
    ' ',
  ];

  const filtered = _.flattenDeep(components).filter(
    comp => comp && typeof comp === 'string'
  );

  const prompt = filtered.join('');
  return prompt;
};

buildPrompt()
  .then(console.log)
  .catch(error => {
    console.error('Error generating prompt');
    console.error(error);
    console.log('\\w ');
  });
