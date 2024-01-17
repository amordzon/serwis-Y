export const InfiniteScrollDownMixin = {
  data() {
    return {
      isContentOver: false,
    };
  },
  methods: {
    attachInfiniteScroll(fetchNext) {
      if (!this.isContentOver) {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          fetchNext();
        }
      }
    },
    setContentOver() {
      this.isContentOver = true;
    },
    resetContentOver() {
      this.isContentOver = false;
    },
  },
};
