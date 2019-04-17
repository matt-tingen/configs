const color = require('./color');
const gitStatus = require('./gitStatus');
const getBranch = require('./branch');
const getEmpty = require('./empty');
const getFlags = require('./flags');
const getUpstream = require('./upstream');
const getState = require('./state');
const flattenDeep = require('./flattenDeep');
const cwd = require('./cwd');

const processPrompt = components =>
  flattenDeep(components)
    .filter(comp => comp && typeof comp === 'string')
    .join('');

const buildGitPrompt = async () => {
  const status = await gitStatus();

  if (!status) {
    return '';
  }

  const branch = getBranch(status);
  const empty = getEmpty(status);
  const flags = getFlags(status);
  const upstream = getUpstream(status);
  const state = getState(status);

  const separator = color('gray')(' - ');

  return processPrompt([
    color('gray')('['),
    empty || [
      state && [state, separator],
      branch,
      !status.branch.detached && upstream && ` ${upstream}`,
      flags && [separator, flags],
    ],
    color('gray')(']'),
  ]);
};

const buildTimestamp = () => {
  const time = new Date().toLocaleTimeString();

  return [color('gray')('['), color('white')(time), color('gray')(']')];
};

const buildPrompt = async () => {
  const showTimestamp = process.env.PROMPT_TIMESTAMP === '1';
  const gitPrompt = await buildGitPrompt();

  return processPrompt([
    showTimestamp && [buildTimestamp(), ' '],
    await cwd(!!gitPrompt),
    gitPrompt && [' ', gitPrompt],
    ' ',
  ]);
};

buildPrompt()
  .then(console.log)
  .catch(error => {
    console.error('Error generating prompt');
    console.error(error);
    console.log('\\w ');
  });
