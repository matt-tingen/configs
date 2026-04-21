const count = (items: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  items.forEach((item) => {
    counts[item] = (counts[item] ?? 0) + 1;
  });

  return counts;
};

export default count;
