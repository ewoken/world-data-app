function fallbackCopyTextToClipboard(text, element = window.body) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  element.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    element.removeChild(textArea);
    return successful
      ? Promise.resolve()
      : Promise.reject(new Error('fallbackCopyTextToClipboard error'));
  } catch (err) {
    element.removeChild(textArea);
    throw Promise.reject(err);
  }
}
function copyTextToClipboard(text, element) {
  return navigator.clipboard
    ? navigator.clipboard.writeText(text)
    : fallbackCopyTextToClipboard(text, element);
}

export default copyTextToClipboard;
