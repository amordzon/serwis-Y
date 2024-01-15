export const InfiniteScrollUpMixin = {
  data() {
    return {
      isContentUpOver: false,
    };
  },
  methods: {
    attachInfiniteScrollUp(fetchPrevious) {
      if (!this.isContentUpOver) {
        let topOfWindow = document.documentElement.scrollTop === 0;
        if (topOfWindow) {
          fetchPrevious();
        }
      }
    },
    setContentUpOver() {
      this.isContentUpOver = true;
    },
  },
};
