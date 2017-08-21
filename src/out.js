class OutCtrl {
  constructor() {
    /**
     * @type {RegExp}
     */
    this.emojiCharSeq = /[0-9\uD83D\uD83C]/;
    /**
     * @type {RegExp}
     */
    // emojiRegEx: /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u263a\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|[0-9]\u20e3|[\u200C\u200D])+)/g,
    this.emojiRegEx = /((?:[\uFE0F\uE000-\uF8FF\u270A-\u2764\u2122\u231B\u25C0\u25FB-\u25FE\u2615\u2620\u2639\u2648-\u2653\u2660-\u2668\u267B\u267F\u2693\u261d\u26A0-\u26FA\u2708\u2702\u2601\u260E]|[\u2600\u26C4\u26BE\u23F3\u2705\u2764]|[\uD83D\uD83C][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|\uD83E\uDD38|\uD83E\uDD44|[0-9]\u20e3|[\u200C\u200D])+)/g;
  }

  get $emoji() {
    if (!window.$simpleSmile.service)
    {
      console.warn('service not found', window.$simpleSmile.service);
      return false;
    }
    return window.$simpleSmile.service;
  }

  encode(value) {
    if (!value) return '';
    let result = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br />');
    result = this.emojiToHTML(result);
    return result;
  }

  /**
   * @param  {String} code   Код символа
   * @param  {String} symbol Сам символ
   * @return {String}        HTML код картинки
   */
  getEmojiHTML(code, symbol) {
    let pos = this.$emoji.getEmojiBgPos(code, symbol);
    if (!pos)
      return console.warn(`Emoji ${code} not exists`);

    return `<i class="emoji" style="background-position: ${pos}">&nbsp;</i>`;
  }

  /**
   * Преобразует символы смайликов в строке в соотведствующие изображения
   * @param  {String} str Строка для преобразования
   * @return {String}     Изменённая строка
   */
  emojiToHTML(str) {
    // console.log(str);
    const regs = {
      'D83DDE07': /(\s|^)([0OО]:\))([\s\.,]|$)/g,
      'D83DDE09': /(\s|^)(;-\)+)([\s\.,]|$)/g,
      'D83DDE06': /(\s|^)([XХxх]-?D)([\s\.,]|$)/g,
      'D83DDE0E': /(\s|^)(B-\))([\s\.,]|$)/g,
      'D83DDE0C': /(\s|^)(3-\))([\s\.,]|$)/g,
      'D83DDE20': /(\s|^)(&gt;\()([\s\.,]|$)/g,
      'D83DDE30': /(\s|^)(;[oоOО])([\s\.,]|$)/g,
      'D83DDE33': /(\s|^)(8\|)([\s\.,]|$)/g,
      'D83DDE32': /(\s|^)(8-?[oоOО])([\s\.,]|$)/g,
      'D83DDE0D': /(\s|^)(8-\))([\s\.,]|$)/g,
      'D83DDE37': /(\s|^)(:[XХ])([\s\.,]|$)/g,
      'D83DDE28': /(\s|^)(:[oоOО])([\s\.,]|$)/g,
      '2764': /(\s|^)(&lt;3)([\s\.,]|$)/g,
      'D83DDE0A': /(:-\))([\s\.,]|$)/g,
      'D83DDE03': /(:-D)([\s\.,]|$)/g,
      'D83DDE1C': /(;-[PР])([\s\.,]|$)/g,
      'D83DDE0B': /(:-[pр])([\s\.,]|$)/g,
      'D83DDE12': /(:-\()([\s\.,]|$)/g,
      '263A': /(:-?\])([\s\.,]|$)/g,
      'D83DDE0F': /(;-\])([\s\.,]|$)/g,
      'D83DDE14': /(3-?\()([\s\.,]|$)/g,
      'D83DDE22': /(:&#039;\()([\s\.,]|$)/g,
      'D83DDE2D': /(:_\()([\s\.,]|$)/g,
      'D83DDE29': /(:\(\()([\s\.,]|$)/g,
      //'D83DDE15': /(:\\)([\s\.,]|$)/g,
      'D83DDE10': /(:\|)([\s\.,]|$)/g,
      'D83DDE21': /(&gt;\(\()([\s\.,]|$)/g,
      'D83DDE1A': /(:-\*)([\s\.,]|$)/g,
      'D83DDE08': /(\}:\))([\s\.,]|$)/g,
      'D83DDC4D': /(:like:)([\s\.,]|$)/g,
      'D83DDC4E': /(:dislike:)([\s\.,]|$)/g,
      '261D': /(:up:)([\s\.,]|$)/g,
      '270C': /(:v:)([\s\.,]|$)/g,
      'D83DDC4C': /(:ok:|:ок:)([\s\.,]|$)/g
    };

    for (let code in regs) {
      // str = str.replace(regs[code], this.getEmojiHTML(code));
    }

    return str.replace(this.emojiRegEx, (v) => this.emojiReplace(v)).replace(/\uFE0F/g, '');
  }

  /**
   * Подбирает коды к найденным символам
   * @param  {String} symbolstr Символ для замены
   */
  emojiReplace(symbolstr) {
    let buffer = '';
    let numbuffer = 0;
    let altBuffer = '';
    let joiner = false;
    let isFlag = false;
    let out = '';

    const symbols = [];
    const codes = [];
    for (let i = 0; i < symbolstr.length; i++) {
      const num = symbolstr.charCodeAt(i);
      const code = num.toString(16).toUpperCase();
      const symbol = symbolstr.charAt(i);

      if (i === 1 && num === 8419) {
        codes.push('003' + symbolstr.charAt(0) + '20e3');
        symbols.push(symbolstr.charAt(0));
        buffer = '';
        altBuffer = '';
        continue;
      }

      buffer += code;
      if (num & 0xd800) {
        if (num & 0x400) {
          // low surrogate
          if (numbuffer) {
            numbuffer = (numbuffer << 10) + (num - 0xdc00);
          }
        } else {
          // high surrogate
          numbuffer = num - 0xd800 + 0x40;
        }
      }
      altBuffer += symbol;
      if (!symbol.match(this.emojiCharSeq)) {
        // console.log('buffer', buffer, numbuffer, (num & 0xd800).toString(2), numbuffer.toString(16));
        if (numbuffer)
          codes.push(numbuffer.toString(16));
        else
          codes.push(buffer.toLowerCase());

        symbols.push(altBuffer);
        buffer = '';
        numbuffer = 0;
        altBuffer = '';
      }
    }

    if (buffer) {
      codes.push(buffer.toLowerCase());
      symbols.push(altBuffer);
    }

    buffer = '';
    altBuffer = '';

  let safe = 10;

    for (let i = 0; i < codes.length; ) {
      let maxlen = 0;
      for (let j = i+1; j <= codes.length && j< i+10; j++) {
        let line = codes.slice(i, j);
        // console.log(line.join('-'));
        if (line.join('-') in this.$emoji.index) {
          maxlen = j-i;
        }
      }
      if (maxlen)
        out += this.getEmojiHTML(codes.slice(i, i+maxlen).join('-'))
      else
        ;//console.warn("max len is null", codes, i);

      i+=maxlen;
      if (safe-- < 0) break;
    }
    return out;
  }

  set value(value) {
    this._value = value;
    this.html = this.$sce.trustAsHtml(this.encode(value));
  }

  get value() {
    return this._value;
  }

  pretty(value) {
    this.value = value;
    return this.html;
  }
}

let out = new OutCtrl();

export default out;
