const color = require('./color');
const gitStatus = require('./gitStatus');
const getBranch = require('./branch');
const getEmpty = require('./empty');
const getFlags = require('./flags');
const getUpstream = require('./upstream');
const flattenDeep = require('./flattenDeep');

const gitDisplay = async () => {
  const status = await gitStatus();

  if (!status) {
    return '';
  }

  const branch = getBranch(status);
  const empty = getEmpty(status);
  const flags = getFlags(status);
  const upstream = getUpstream(status);

  return [
    color('gray')(' ['),
    empty || [
      branch,
      !status.branch.detached && upstream && ` ${upstream}`,
      flags && [color('gray')(' - '), flags],
    ],
    color('gray')(']'),
  ];
};

const buildPrompt = async () => {
  const components = [
    color('cyan')('\\w'), // Working dir
    await gitDisplay(),
    ' ',
  ];

  const filtered = flattenDeep(components).filter(
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
