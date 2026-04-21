type NestedArray<T> = Array<T | NestedArray<T>>;

const flattenDeep = <T>(array: NestedArray<T>): T[] => {
  const flattened: T[] = [];

  array.forEach((item) => {
    if (Array.isArray(item)) {
      flattened.push(...flattenDeep(item));
    } else {
      flattened.push(item);
    }
  });

  return flattened;
};

export default flattenDeep;
