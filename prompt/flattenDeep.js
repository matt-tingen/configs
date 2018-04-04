const flattenDeep = array => {
  const flattened = [];

  array.forEach(item => {
    if (Array.isArray(item)) {
      flattened.push(...flattenDeep(item));
    } else {
      flattened.push(item);
    }
  });

  return flattened;
};

module.exports = flattenDeep;
