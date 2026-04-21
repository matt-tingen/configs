import getBranch from './branch.ts';
import color from './color.ts';
import cwd from './cwd.ts';
import getEmpty from './empty.ts';
import getFlags from './flags.ts';
import flattenDeep from './flattenDeep.ts';
import gitStatus from './gitStatus.ts';
import lockfileStatus from './lockfile.ts';
import getState from './state.ts';
import getUpstream from './upstream.ts';
import vpnStatus from './vpn.ts';

type Component = string | number | false | null | undefined | Component[];

const processPrompt = (components: Component[]): string =>
  flattenDeep(components)
    .filter((comp): comp is string => typeof comp === 'string' && comp.length > 0)
    .join('');

const buildGitPrompt = async (): Promise<string> => {
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

const buildTimestamp = (): Component[] => {
  const time = new Date().toLocaleTimeString();

  return [color('gray')('['), color('white')(time), color('gray')(']')];
};

const buildPrompt = async (): Promise<string> => {
  const showTimestamp = process.env.PROMPT_TIMESTAMP === '1';
  const gitPrompt = await buildGitPrompt();

  return processPrompt([
    await vpnStatus(),
    await lockfileStatus(),
    showTimestamp && [buildTimestamp(), ' '],
    await cwd(),
    gitPrompt && [' ', gitPrompt],
    ' ',
  ]);
};

buildPrompt()
  .then(console.log)
  .catch((error) => {
    console.error('Error generating prompt');
    console.error(error);
    console.log('\\w ');
  });
