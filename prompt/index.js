const _ = require('lodash');

const color = require('./color');
const getBranch = require('./branch');
const getFlags = require('./flags');
const getUpstream = require('./upstream');

const gitStatus = async () => {
  const branch = await getBranch();

  if (!branch) {
    return '';
  }

  const flags = await getFlags();
  const upstream = await getUpstream();

  return [
    color('gray')(' ['),
    color('blue')(branch),
    upstream && ` ${upstream}`,
    flags && [color('gray')(' - '), flags],
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
