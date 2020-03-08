const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const ENABLED = process.env.DISABLE_PROMPT_CACHE !== '1';
const CACHE_FILE = path.resolve(__dirname, '.cache');

const checkCache = async status => {
  if (!ENABLED) {
    return null;
  }

  let contents;
  try {
    contents = JSON.parse(await fs.readFile(CACHE_FILE));
  } catch {
    return null;
  }

  return status === contents.status ? contents.output : null;
};

const updateCache = async (status, output) => {
  if (!ENABLED) {
    return;
  }

  const contents = JSON.stringify({
    status,
    output,
  });

  await fs.writeFile(CACHE_FILE, contents);
};

module.exports = {
  checkCache,
  updateCache,
};
