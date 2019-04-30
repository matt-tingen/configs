const memoize = fn => {
  const cache = {};

  return arg => {
    if (!cache[arg]) {
      cache[arg] = fn(arg);
    }

    return cache[arg];
  };
};

module.exports = memoize;
