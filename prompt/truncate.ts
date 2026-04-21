const truncate = (text: string, length: number, continuation = '…'): string =>
  text.length <= length
    ? text
    : text.substr(0, length - continuation.length) + continuation;

export default truncate;
