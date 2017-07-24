var unicodeMap = require('./map');
var unicodeReg = /([\u00a9-\u3299]\ufe0f)|([\u0023-\u0039]\u20e3)|(\ud83c[\udd70-\udff0])|(\ud83d[\udc00-\udec0])|[\ue001-\ue537]/gi;
var simpleSmile = {
  container: null,
};

function replaceFunc (s, path) {
  var emotionName = '';
  var unicode = '';
  if (s.length == 1){
    if (/^[\ue001-\ue537]/.test(s)){
      emotionName = s.charCodeAt(0).toString(16);

    } else{
      var charCode = s.charCodeAt(0);
      emotionName = charCode;
    }
  } else {
    var high = s.charCodeAt(0);
    var low = s.charCodeAt(1);
    high.toString(16);
    low.toString(16);
    if (/^([\u00a9-\u3299]\ufe0f)|[\u0023-\u0039]\u20e3/.test(s)){
      unicode = s.charCodeAt(0);
    } else{
      unicode = (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
    }
    emotionName = unicode;
  }

  if (emotionName){
    unicode = unicode.toString(16).toUpperCase();

    return `<i alt=${s} class="emoji emoji-${unicode}">&nbsp;</i>`;
  } else{
    return '';
  }
}

function VueSimpleEmoji (str) {
  if (!str) return str;
  return str.replace(unicodeReg, function (s) {
    return replaceFunc(s, VueEmoji.DEFAULT_PATH)
  })
}
// emoji resource default path
VueSimpleEmoji.DEFAULT_PATH = '';
VueSimpleEmoji.install = function (Vue, option) {

  Object.defineProperty(Vue.prototype, '$simpleSmile', {
    get() {
      return window.$simpleSmile;
    },
  });

  Vue.filter('emoji', VueSimpleEmoji);
  if (option && option.path) {
    VueSimpleEmoji.DEFAULT_PATH = option.path
  }
};

module.exports = VueSimpleEmoji;

