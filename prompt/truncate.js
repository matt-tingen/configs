const truncate = (text, length, continuation = '…') =>
  text.length <= length
    ? text
    : text.substr(0, length - continuation.length) + continuation;

module.exports = truncate;
