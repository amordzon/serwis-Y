<template>
  <div>
    <BaseModal :show="showLogInModal">
      <div class="p-4 flex items-center justify-center flex-col relative">
        <div
          class="absolute text-xl top-0 right-0 p-4 cursor-pointer"
          @click="resetAndClose"
        >
          x
        </div>
        <div class="text-3xl font-bold tracking-wide my-4">Sign in to X</div>
        <form
          class="flex flex-col items-center w-full"
          @submit.prevent="handleSubmission"
        >
          <input
            class="form-input"
            id="email"
            type="text"
            placeholder="Email"
            v-model="form.email"
          />
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Password"
            v-model="form.password"
          />
          <button
            class="mt-14 mb-6 bg-sky-500 hover:bg-sky-600 font-semibold py-3 w-3/4 rounded-full"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import axios from "axios";
import BaseModal from "../BaseModal.vue";

export default {
  components: {
    BaseModal,
  },
  props: ["showLogInModal"],
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleSubmission() {
      axios
        .post("http://localhost:3000/auth/login", this.form)
        .then((response) => {
          console.log(response);
          this.resetAndClose();
        })
        .catch((error) => {
          console.log("error ", error);
          this.$emit("emit-error", error);
        });
    },
    resetForm() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
    resetAndClose() {
      this.resetForm();
      this.$emit("close-modal");
    },
  },
};
</script>
