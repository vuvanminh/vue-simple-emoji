let emoji = require('./Emoji');
let data = require('../lib/data').default;

class EmojiService {
  constructor() {
    this.data = data;
    this.categories = ['Recent'];
    this.recent = [];
    this.index = {};
    this.utf16 = {};

    for (let i in this.data) {
      this.categories.push(i);
      this.data[i].forEach(item => {
        this.index[item.unified] = item;
        this.utf16[item.utf16] = item;
      });
    }
  }

  getRecent(count) {
    if (!count) count = 54;

    let recent = localStorage.getItem('recentEmoji');
    if (recent) {
      recent = recent.split(',');
      let data = recent.map(emoji => {
        for (let name in this.data) {
          let cat = this.data[name];
          let res = cat.find(item => item.short === emoji);
          if (res) return res;
        }
      });

      this.recent = data;
    } else this.recent = [];

    let data = [];
    for (let i = 0; i < count; i++)
      if (this.recent[i])
        data.push(this.recent[i]);
      else
        break;

    if (data.length < count)
      for (let i = 0; data.length < count; i++)
        if (data.indexOf(this.data.People[i]) === -1)
          data.push(this.data.People[i]);

    return data;
  }

  /**
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @return {String}        HTML код картинки
   */
  getEmojiBgPos(code, symbol) {
    let info = this.utf16[code];
    if (!info)
      return false;//console.warn(`Emoji ${code} not exists`);

    let x = Math.round(100000 / 48 * info.x) / 1000;
    let y = Math.round(100000 / 48 * info.y) / 1000;
    return `${x}% ${y}%`;
  }

  saveRecent() {
    let emojis = this.recent.map(item => item.short);
    if (emojis.length > 100) emojis.length = 100;
    localStorage.setItem('recentEmoji', emojis.join(','));
  }

  addRecentEmoji(emoji) {
    this.recent.forEach((item, index) => {
      if (item.short === emoji.short)
        this.recent.splice(index, 1);
    });
    this.recent.unshift(emoji);
    this.saveRecent();
  }

  getCategory(name) {
    if (!name)
      name = 0;

    if (typeof name === 'number' && this.categories[name])
      name = this.categories[name];

    if (name === 'Recent')
      return this.getRecent();

    if (!this.data[name])
      throw new Error("error emoji category " + name);

    return this.data[name];
  }
}

var simpleSmile = {
  container: null,
  service: new EmojiService(),
  open: (callback, element, orientation) => window.$simpleSmile.container.open(callback, element, orientation)
};

window.$simpleSmile = simpleSmile;

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

