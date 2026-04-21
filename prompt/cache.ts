import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GitStatus } from './types.ts';

// The cache has a bug where it does not invalidate when aborting e.g. rebase.
const ENABLED = false; // process.env.DISABLE_PROMPT_CACHE !== '1';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.resolve(__dirname, '.cache');

interface CacheContents {
  status: string;
  output: GitStatus;
}

export const checkCache = async (status: string): Promise<GitStatus | null> => {
  if (!ENABLED) {
    return null;
  }

  let contents: CacheContents;
  try {
    contents = JSON.parse(await fs.readFile(CACHE_FILE, 'utf8')) as CacheContents;
  } catch {
    return null;
  }

  return status === contents.status ? contents.output : null;
};

export const updateCache = async (status: string, output: GitStatus): Promise<void> => {
  if (!ENABLED) {
    return;
  }

  const contents = JSON.stringify({
    status,
    output,
  });

  await fs.writeFile(CACHE_FILE, contents);
};
