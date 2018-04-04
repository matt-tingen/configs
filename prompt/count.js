const count = items => {
  const counts = {};

  items.forEach(item => {
    if (!counts[item]) {
      counts[item] = 0;
    }

    counts[item]++;
  });

  return counts;
};

module.exports = count;
