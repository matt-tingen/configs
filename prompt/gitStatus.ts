import fs from 'node:fs';
import path from 'node:path';
import { checkCache, updateCache } from './cache.ts';
import git from './git.ts';
import type { BranchStatus, Change, GitState, GitStatus, TagInfo } from './types.ts';

// https://git-scm.com/docs/git-status#_branch_headers
const parseStatus = (message: string): { branch: BranchStatus; changes: Change[] } => {
  const lines = message.split('\n');
  const branchLines = lines.filter((line) => line.startsWith('#'));
  const changeLines = lines.slice(branchLines.length);

  return {
    branch: parseBranchStatus(branchLines),
    changes: parseChangeStatus(changeLines),
  };
};

const parseBranchStatus = (lines: string[]): BranchStatus => {
  if (lines.length === 3) {
    // Upstream is set, but commit is not present.
    return { empty: true };
  }

  const upstream = lines.length > 2;
  let ahead: number | undefined;
  let behind: number | undefined;

  if (upstream) {
    const abMatch = /branch\.ab \+(\d+) -(\d+)/.exec(lines[3]);
    if (abMatch) {
      ahead = parseInt(abMatch[1]);
      behind = parseInt(abMatch[2]);
    }
  }

  const hash = lines[0].slice(13); // # branch.oid <oid>
  const head = lines[1].slice(14); // # branch.head <head>
  const detached = head === '(detached)';
  const name = detached ? null : head;
  const empty = hash === '(initial)';

  return {
    upstream,
    hash,
    name,
    detached,
    ahead,
    behind,
    empty,
  };
};

// https://git-scm.com/docs/git-status#_changed_tracked_entries
const parseChangeStatus = (lines: string[]): Change[] => {
  const regex = /^(?:[12u] (..)|([\?!]))/;
  return lines
    .map((line) => {
      const match = regex.exec(line);
      if (!match) return null;
      const flags = match[1] || match[2];
      const x = flags[0];
      // ? and ! are treated as `??` or `!!` as in the short status format.
      const y = flags[1] || x;
      return {
        x: x === '.' ? null : x,
        y: y === '.' ? null : y,
      };
    })
    .filter((c): c is Change => c !== null);
};

const getNotes = async (): Promise<string | null> => {
  try {
    return await git('log -n 1 --pretty=format:%s');
  } catch {
    return null;
  }
};

const getState = async (): Promise<GitState | undefined> => {
  const gitRoot = await git('root');
  const exists = (item: string): boolean => fs.existsSync(path.join(gitRoot, '.git', item));

  if (exists('rebase-merge') || exists('rebase-apply')) {
    return 'rebase';
  }

  if (exists('MERGE_HEAD')) {
    return 'merge';
  }

  if (exists('BISECT_LOG')) {
    return 'bisect';
  }

  return undefined;
};

const doesPromiseSucceed = async (promise: Promise<unknown>): Promise<boolean> => {
  try {
    await promise;
    return true;
  } catch {
    return false;
  }
};

const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(reject, ms);
    }),
  ]);

const getTag = async (): Promise<TagInfo> => {
  let description = '';

  const isTagged = await doesPromiseSucceed(
    timeout(git('describe --exact-match'), 50),
  );

  if (isTagged) {
    try {
      description = await git('describe --tags --always');
    } catch {}
  }

  return {
    description,
    isTagged,
  };
};

const shortenHash = (hash: string): Promise<string> => git(`rev-parse --short ${hash}`);

const isBareRoot = async (): Promise<boolean> => {
  try {
    const [gitDir, commonDir] = await Promise.all([
      git('rev-parse --git-dir'),
      git('rev-parse --git-common-dir'),
    ]);

    return gitDir !== '.git' && path.resolve(gitDir) === path.resolve(commonDir);
  } catch {
    return false;
  }
};

const status = async (): Promise<GitStatus | null> => {
  // `git status` hangs in bare repo roots
  if (await isBareRoot()) {
    return null;
  }

  let message: string;

  try {
    message = await git('status --porcelain=v2 --branch');
  } catch {
    return null;
  }

  const cached = await checkCache(message);

  if (cached) {
    return cached;
  }

  const parsed = parseStatus(message);

  if (!parsed.branch.empty && parsed.branch.hash) {
    parsed.branch.hash = await shortenHash(parsed.branch.hash);
  }

  const output: GitStatus = {
    ...parsed,
    tag: await getTag(),
    notes: await getNotes(),
    state: await getState(),
  };

  void updateCache(message, output);

  return output;
};

export default status;
