const copyToClipboard = async (str: string) => {
  try {
    navigator.clipboard.writeText(str);
    return true;
  } catch (err) {
    // android webview need permissions to write to clipboard which can't be handeled in JS
    // see here : https://stackoverflow.com/questions/61243646/clipboard-api-call-throws-notallowederror-without-invoking-onpermissionrequest
    let textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0px';
    textArea.style.left = '0px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0px';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = str;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      return true;
    } catch (err) {
      return false;
    }
  }
};
export default copyToClipboard;
