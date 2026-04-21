const memoize = <T>(fn: (arg: string) => T): ((arg: string) => T) => {
  const cache: Record<string, T> = {};

  return (arg: string): T => {
    if (!(arg in cache)) {
      cache[arg] = fn(arg);
    }

    return cache[arg];
  };
};

export default memoize;
