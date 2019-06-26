const fs = require('fs');
const path = require('path');

function generate(dictionary, options) {
  const { numWords, length, seperator } = options;
  const lengthWithoutSeparators = length - (numWords - 1) * seperator.length;
  const availableWordsByLength = groupBy(dictionary, word => word.length);
  const wordLengthWeights = Object.entries(availableWordsByLength).map(
    ([length, words]) => ({ length: parseInt(length), weight: words.length }),
  );
  const possibleWordLengths = getPossibleWordLengths(
    wordLengthWeights,
    numWords,
    lengthWithoutSeparators,
  );

  if (!possibleWordLengths.length) {
    throw new Error('Generation is overconstrained');
  }

  // TODO: Bail out if entropy is too low

  const wordLengths = choice(possibleWordLengths);
  // TODO: Disallow re-using words
  const words = wordLengths.map(length =>
    choice(availableWordsByLength[length]),
  );
  const password = words.join(seperator);
  return password;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function sum(values) {
  return values.reduce((sum, value) => sum + value, 0);
}

function choice(items, getWeight = () => 1) {
  const weights = items.map(getWeight);
  const totalWeight = sum(weights);
  let remainingWeight = randomInt(0, totalWeight);

  for (let i = 0; i < items.length; i++) {
    const weight = weights[i];
    remainingWeight -= weight;

    if (remainingWeight < 0) {
      return items[i];
    }
  }
}

function shuffle(items) {
  const shuffled = [...items];

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i >= 1; i--) {
    const j = randomInt(0, i + 1);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return shuffled;
}

function groupBy(items, iteree) {
  const grouped = {};

  items.forEach(item => {
    const key = iteree(item);
    const group = (grouped[key] = grouped[key] || []);
    group.push(item);
  });

  return grouped;
}

function flatten(items) {
  return [].concat(...items);
}

function flatMap(items, iteree) {
  const mapped = items.map(iteree);
  return flatten(mapped);
}

/** @typedef {{length: number, weight: number}} WordLengthWeight */

/**
 * Find all the possible series of word lengths which can satisfy the provided
 * constraints
 * @param {WordLengthWeight[]} wordLengthWeights The available word lengths
 * along with their corresponding weights
 * @param {number} numWords The desired number of words
 * @param {number} totalLength The desired sum of the result word lengths
 * @returns {number[][]} A list of word lengths
 */
function getPossibleWordLengths(wordLengthWeights, numWords, totalLength) {
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
