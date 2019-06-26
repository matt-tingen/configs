const fs = require('fs');
const path = require('path');

function generate(dictionary, options) {
  const { numWords, length, seperator } = options;
  const lengthWithoutSeparators = length - (numWords - 1) * seperator.length;
  // Sorting is not strictly required, but is useful for debugging.
  const availableWordLengths = sort(uniq(dictionary.map(word => word.length)));
  const possibleWordLengths = getPossibleWordLengths(
    availableWordLengths,
    numWords,
    lengthWithoutSeparators,
  );

  if (!possibleWordLengths.length) {
    throw new Error('Generation is overconstrained');
  }

  // TODO: Bail out if entropy is too low

  const wordLengths = choice(possibleWordLengths);
  // TODO: Disallow re-using words
  const words = wordLengths.map(length => getWord(dictionary, length));
  const password = words.join(seperator);
  return password;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function choice(items) {
  const i = randomInt(0, items.length);
  return items[i];
}

function getWord(dictionary, length) {
  const eligibleWords = dictionary.filter(word => word.length === length);
  return choice(eligibleWords);
}

function uniq(items) {
  return Array.from(new Set(items).values());
}

function sort(values) {
  return [...values].sort((a, b) => a - b);
}

function flatten(items) {
  return [].concat(...items);
}

function flatMap(items, iteree) {
  const mapped = items.map(iteree);
  return flatten(mapped);
}

/**
 * Find all the possible series of word lengths which can satisfy the provided
 * constraints
 * @param {string[]} availableWordLengths The word lengths which can be used
 * @param {number} numWords The desired number of words
 * @param {number} totalLength The desired sum of the result word lengths
 * @returns {number[][]} A list of word lengths
 */
function getPossibleWordLengths(availableWordLengths, numWords, totalLength) {
  if (numWords === 1) {
    // TODO: Allow flexibility without introducing bias wrt word length in
    // relation to order of word length selection (i.e. recursion depth). For
    // example, selection the largest available word length which is <=
    // totalLength introduces a bias for shorter words near the end of the
    // password. Doing this properly will also require specifying a _minimum_
    // total length.
    return availableWordLengths.includes(totalLength) ? [[totalLength]] : [];
  }

  const candidateWordLengths = availableWordLengths.filter(
    length => length <= totalLength,
  );

  return flatMap(candidateWordLengths, length => {
    const possibleSuccessiveWordLengths = getPossibleWordLengths(
      availableWordLengths,
      numWords - 1,
      totalLength - length,
    );

    return possibleSuccessiveWordLengths.map(successiveLengths => [
      length,
      ...successiveLengths,
    ]);
  });
}

const defaultOptions = {
  numWords: 3,
  length: 24,
  seperator: ' ',
};

function tryParseInt(value, name) {
  const parsed = parseInt(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be an integer`);
  }

  return parsed;
}

function getOptions() {
  const [, , ...args] = process.argv;
  const numArgs = args.length;
  const options = { ...defaultOptions };

  if (numArgs !== 0) {
    try {
      if (numArgs >= 2) {
        options.numWords = tryParseInt(args[0], 'num_words');
        options.length = tryParseInt(args[1], 'length');

        if (numArgs >= 3) {
          options.seperator = args[2];

          if (numArgs > 3) {
            throw new Error('too many args');
          }
        }
      } else {
        throw new Error('invalid number of args');
      }
    } catch (error) {
      throw new Error(
        [
          `Invalid usage: ${error.message}`,
          'Usage: pw [num_words length [separator]]',
        ].join('\n'),
      );
    }
  }

  return options;
}

function getDictionary() {
  const dictionaryPath = path.join(__dirname, 'dict.txt');
  const fileContents = fs.readFileSync(dictionaryPath, 'utf8');
  return fileContents.split('\n');
}

function main() {
  const dictionary = getDictionary();

  try {
    const options = getOptions();

    try {
      const password = generate(dictionary, options);
      console.log(password);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
