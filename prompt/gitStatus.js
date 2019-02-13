const git = require('./git');
const fs = require('fs');
const path = require('path');

// https://git-scm.com/docs/git-status#_branch_headers
const parseStatus = message => {
  const lines = message.split('\n');
  const branchLines = lines.filter(line => line.startsWith('#'));
  const changeLines = lines.slice(branchLines.length);

  return {
    branch: parseBranchStatus(branchLines),
    changes: parseChangeStatus(changeLines),
  };
};

const parseBranchStatus = lines => {
  if (lines.length === 3) {
    // Upstream is set, but commit is not present.
    return { empty: true };
  }

  const upstream = lines.length > 2;
  let ahead;
  let behind;

  if (upstream) {
    const abMatch = /branch\.ab \+(\d+) -(\d+)/.exec(lines[3]);
    ahead = parseInt(abMatch[1]);
    behind = parseInt(abMatch[2]);
  }

  const oid = lines[0].slice(13); // # branch.oid <oid>
  const head = lines[1].slice(14); // # branch.head <head>
  const detached = head === '(detached)';
  const ref = detached ? oid : head;

  return {
    upstream,
    ref,
    detached,
    ahead,
    behind,
  };
};

// https://git-scm.com/docs/git-status#_changed_tracked_entries
const parseChangeStatus = lines => {
  const regex = /^(?:[12u] (..)|([\?!]))/;
  return lines.map(line => {
    const match = regex.exec(line);
    const flags = match[1] || match[2];
    const x = flags[0];
    // ? and ! are treated as `??` or `!!` as in the short status format.
    const y = flags[1] || x;
    return {
      x: x === '.' ? null : x,
      y: y === '.' ? null : y,
    };
  });
};

const getState = async () => {
  const gitRoot = await git('root');
  const exists = item => fs.existsSync(path.join(gitRoot, '.git', item));

  if (exists('rebase-merge') || exists('rebase-apply')) {
    return 'rebase';
  }

  if (exists('MERGE_HEAD')) {
    return 'merge';
  }

  if (exists('BISECT_LOG')) {
    return 'bisect';
  }
};

const status = async () => {
  let message;

  try {
    message = await git('status --porcelain=v2 --branch');
  } catch (e) {
    return null;
  }

  return {
    ...parseStatus(message),
    state: await getState(),
  };
};

module.exports = status;
