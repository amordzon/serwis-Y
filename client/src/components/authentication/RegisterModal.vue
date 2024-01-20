<template>
  <div>
    <BaseModal :show="showSignUpModal">
      <div class="p-4 flex items-center justify-center flex-col relative">
        <div
          class="absolute text-xl top-0 right-0 p-4 cursor-pointer"
          @click="resetAndClose"
        >
          x
        </div>
        <div class="text-3xl font-bold tracking-wide my-4">
          Create your account
        </div>
        <form
          class="flex flex-col items-center w-full"
          @submit.prevent="handleSubmission"
        >
          <input
            class="form-input"
            id="name"
            type="text"
            placeholder="Name"
            v-model="form.name"
          />
          <span v-if="errors.name" class="text-red-500 w-3/4 mt-1 pl-3">{{
            errors.name
          }}</span>
          <input
            class="form-input"
            id="email"
            type="text"
            placeholder="Email"
            v-model="form.email"
          />
          <span v-if="errors.email" class="text-red-500 w-3/4 mt-1 pl-3">{{
            errors.email
          }}</span>
          <input
            class="form-input"
            id="username"
            type="text"
            placeholder="Username"
            v-model="form.username"
          />
          <span v-if="errors.username" class="text-red-500 w-3/4 mt-1 pl-3">{{
            errors.username
          }}</span>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Password"
            v-model="form.password"
          />
          <span v-if="errors.password" class="text-red-500 w-3/4 mt-1 pl-3">{{
            errors.password
          }}</span>
          <input
            class="form-input"
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            v-model="form.confirmPassword"
          />
          <span
            v-if="errors.confirmPassword"
            class="text-red-500 w-3/4 mt-1 pl-3"
            >{{ errors.confirmPassword }}</span
          >
          <button
            class="mt-14 mb-6 bg-sky-500 hover:bg-sky-600 font-semibold py-3 w-3/4 rounded-full"
            type="submit"
          >
            Create an account
          </button>
        </form>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from "../BaseModal.vue";
import axios from "axios";

export default {
  components: {
    BaseModal,
  },
  props: ["showSignUpModal"],
  data() {
    return {
      form: {
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      errors: {
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
    };
  },

  watch: {
    "form.name"(value) {
      this.form.name = value;
      if (value !== "") {
        this.validateName(value);
      }
    },
    "form.username"(value) {
      this.form.username = value;
      if (value !== "") {
        this.validateUsername(value);
      }
    },
    "form.email"(value) {
      this.form.email = value;
      if (value !== "") {
        this.validateEmail(value);
      }
    },
    "form.password"(value) {
      this.form.password = value;
      if (value !== "") {
        this.validatePassword(value);
      }
    },
    "form.confirmPassword"(value) {
      this.form.confirmPassword = value;
      if (value !== "") {
        this.validateConfirmPassword(value);
      }
    },
  },

  methods: {
    validateName(value) {
      if (value.length < 2 || value.length > 40) {
        this.errors.name = "Name must be 2-40 characters";
      } else if (!/^[\p{L}\s-]+$/u.test(value)) {
        this.errors.name =
          "Name must not contain numbers or special characters";
      } else {
        this.errors.name = "";
      }
    },
    validateUsername(value) {
      if (value.length < 6 || value.length > 20) {
        this.errors.username = "Username must be 6-20 characters";
      } else if (/[ \t,.]+/.test(value)) {
        this.errors.username = "Username must not contain tab characters";
      } else {
        this.errors.username = "";
      }
    },
    validateEmail(value) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        this.errors.email = "";
      } else {
        this.errors.email = "Please enter a valid email.";
      }
    },
    validatePassword(value) {
      if (value.length < 8 || value.length > 20) {
        this.errors.password = "Password must be 8-20 characters";
      } else if (!/\d/.test(value)) {
        this.errors.password = "Password must include at least one number";
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
        this.errors.password =
          "Password must include at least one special character";
      } else {
        this.errors.password = "";
      }
    },
    validateConfirmPassword(value) {
      if (value !== this.form.password) {
        this.errors.confirmPassword = "Passwords must be identical";
      } else {
        this.errors.confirmPassword = "";
      }
    },
    async handleSubmission() {
      const noErrors = Object.values(this.errors).every(
        (error) => error === ""
      );
      if (noErrors) {
        axios
          .post("http://localhost:3000/auth/register", this.form)
          .then(async (response) => {
            console.log(response);
            this.resetAndClose();
            await this.$store.dispatch("user/logIn", {
              user: response.data.user.user,
              jwt: response.data.user.token,
            });
            this.$router.push("/");
          })
          .catch((error) => {
            console.log("error ", error);
            console.log(error);

            this.$emit("emit-error", error);
          });
      }
    },
    resetForm() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });

      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = "";
      });
    },
    resetAndClose() {
      this.resetForm();
      this.$emit("close-modal");
    },
  },
};
</script>
