import sys
import os
import random

separator = ' '
args = sys.argv[1:]
num_args = len(args)

if num_args == 2:
  min_length, max_length = (int(i) for i in args)
elif num_args == 1:
  min_length = max_length = int(args[0])
else:
  min_length, max_length = 16, 32

if (min_length > max_length):
  raise ValueError('min length > max length')

with open(os.path.join(sys.path[0], 'dict.txt')) as f:
  dictionary = [word.rstrip('\n') for word in f]

smallest_word_length = min(len(word) for word in dictionary)

def get_word(min, max):
  return random.choice([word for word in dictionary if max >= len(word) >= min])

def shuffle_words(password):
  words = password.split(separator)
  random.shuffle(words)
  return separator.join(words)

password = get_word(0, max_length)

while len(password) < min_length or max_length - len(password) > smallest_word_length:
  password += separator + get_word(0, max_length - len(password) - 1)

# The second while loop condition produces a bias for shorter words to be more likely at the end.
password = shuffle_words(password)

print(password)
