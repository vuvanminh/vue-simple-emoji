/* eslint-disable */
import Vue from 'vue';
import ps from 'perfect-scrollbar';
import PulseLoader from 'vue-spinner/src/PulseLoader';
import emoji from './Emoji';

const data = {
  count: 1,
  smilesContainerIsShowed: false,
  smileContainerOffset: 48,
  categoryTimeoutId: false,
  category: 0,
  smiles: [],
  empty: true,
};

export default Vue.component('smiles-container', {
  name: 'smiles-container',
  data() {
    return data;
  },
  props: ['value', 'placeholder'],
  components: {emoji},
  template: `
<div
    v-show="smilesContainerIsShowed"
    id="simpleSmile"
    class="smilesContainer smile24"
    ref="smilesContainer"
    onselectstart="return false;"
    onmousedown="return false;"
    @mouseover="onWidgetMouseOver()"
    @mouseout="onWidgetMouseOut()">
<!--v-on-clickaway="hideSmiles"-->
  <div class="smilesCollection" ref="smilesCollection" @click="smilesContainerElementClick">
    <emoji v-for="(smile, key) in smiles" class="emoji" :key="key" :emoji="smile.unified" unselectable="on"></emoji>
  </div>
  <div class="collections" @mouseout="onCategoryMouseOut">
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    @mouseover="onCategoryMouseOver(0)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 192px;" @mouseover="onCategoryMouseOver(1)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 168px;" @mouseover="onCategoryMouseOver(2)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 144px;" @mouseover="onCategoryMouseOver(3)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 120px;" @mouseover="onCategoryMouseOver(4)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 96px;" @mouseover="onCategoryMouseOver(5)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 72px;" @mouseover="onCategoryMouseOver(6)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 48px;" @mouseover="onCategoryMouseOver(7)"></i>
    <i aria-hidden="true" unselectable="on" onselectstart="return false;" onmousedown="return false;"
    style="background-position-y: 24px;" @mouseover="onCategoryMouseOver(8)"></i>
  </div>
</div>`,
  methods: {
    open(callback, element, orientation) {
      this.callback = callback;

      this.selectEmojiCategory(0);

      this.$refs.smilesContainer.style.display = 'block';
      this.$refs.smilesContainer.style.right = '20px';
      this.$refs.smilesCollection.scrollTop = 0;
      this.setPositionForContainer(element, orientation);
      this.widgetTimeoutId = setTimeout(() => this.close(), 300000000);
    },
    close() {
      this.callback = null;

      this.$refs.smilesContainer.style.display = 'none';
    },
    smilesContainerElementClick(e) {
      let emoji = e.target.dataset.id;
      if (emoji && emoji in window.$simpleSmile.service.index) {
        emoji = window.$simpleSmile.service.index[emoji];
        window.$simpleSmile.service.addRecentEmoji(emoji);
        emoji.bgPos = window.$simpleSmile.service.getEmojiBgPos(emoji.unified);
        this.callback(emoji);
      }
    },
    onCategoryMouseOver(category) {
      this.categoryTimeoutId = setTimeout(() => this.selectEmojiCategory(category), 300);
    },
    onCategoryMouseOut() {
      clearTimeout(this.categoryTimeoutId);
    },
    onWidgetMouseOver() {
      clearTimeout(this.widgetTimeoutId);
    },
    onWidgetMouseOut() {
      this.widgetTimeoutId = setTimeout(() => this.close(), 300);
    },
    selectEmojiCategory(category) {
      if (typeof category !== 'undefined')
        this.category = category;

      let Emoji = window.$simpleSmile.service;

      this.smiles = Emoji.getCategory(category);

      this.$nextTick(() => {
        ps.update(this.$refs.smilesCollection);
      });
    },
    setPositionForContainer(element, orientation) {
      function getOffset(elem) {
        if (elem.getBoundingClientRect) {
          // "правильный" вариант
          return getOffsetRect(elem)
        } else {
          // пусть работает хоть как-то
          return getOffsetSum(elem)
        }
      }

      function getOffsetSum(elem) {
        var top = 0, left = 0
        while (elem) {
          top = top + parseInt(elem.offsetTop)
          left = left + parseInt(elem.offsetLeft)
          elem = elem.offsetParent
        }

        return {top: top, left: left}
      }

      function getOffsetRect(elem) {
        // (1)
        var box = elem.getBoundingClientRect()

        // (2)
        var body = document.body
        var docElem = document.documentElement

        // (3)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

        // (4)
        var clientTop = docElem.clientTop || body.clientTop || 0
        var clientLeft = docElem.clientLeft || body.clientLeft || 0

        // (5)
        var top = box.top + scrollTop - clientTop
        var left = box.left + scrollLeft - clientLeft

        return {top: Math.round(top), left: Math.round(left)}
      }

      let offset = getOffset(element);
      offset.top -= this.$refs.smilesContainer.offsetHeight + 90;
      offset.left -= this.$refs.smilesContainer.offsetWidth - 33;

      this.$refs.smilesContainer.style.left = `${offset.left}px`;
      this.$refs.smilesContainer.style.top = `${offset.top}px`;
    },
  },
  mounted() {
    console.log(window.$simpleSmile);
    window.$simpleSmile.container = this;

    ps.initialize(this.$refs.smilesCollection, {
      wheelSpeed: 0.4,
      suppressScrollX: true,
    });
  },
});
