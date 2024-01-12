<template>
  <div>
    <BaseModal :show="postModal.showPostModal">
      <div class="p-4 flex items-center justify-center flex-col relative">
        <div
          class="absolute text-xl top-0 right-0 p-4 cursor-pointer"
          @click="close()"
        >
          x
        </div>
        <NewPost
          @add-post="addPostModal"
          :quotedPost="postModal.quotedPost"
        ></NewPost>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from "../BaseModal";
import NewPost from "../home/NewPost";
import { mapState, mapActions } from "vuex";

export default {
  name: "PostModal",
  components: {
    BaseModal,
    NewPost,
  },
  computed: {
    ...mapState(["postModal"]),
  },
  methods: {
    ...mapActions("tweet", ["addTweet"]),
    ...mapActions("postModal", ["hideModal", "setQuotedPost"]),
    close() {
      console.log("zamknij");
      this.hideModal();
      this.setQuotedPost({});
    },
    addPostModal(post) {
      this.addTweet(post);
      this.close();
    },
  },
};
</script>
