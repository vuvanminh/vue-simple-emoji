/* eslint-disable */
import Vue from 'vue';
import ps from 'perfect-scrollbar';
import PulseLoader from 'vue-spinner/src/PulseLoader';

export default Vue.component('emoji', {
  name: 'emoji',
  data() {
    return {};
  },
  props: ['emoji'],
  template: `<i ref="i" class="emoji" unselectable="on" :data-id="emoji"></i>`,
  watch: {
    emoji: function(emoji) {
      let EmojiService = window.$simpleSmile.service;
      this.$refs.i.style.backgroundPosition = EmojiService.getEmojiBgPos(this.emoji);
    }
  },
  mounted() {
    let EmojiService = window.$simpleSmile.service;
    this.$refs.i.style.backgroundPosition = EmojiService.getEmojiBgPos(this.emoji);
  },
});
