<template>
  <div class="sm:flex justify-center sm:m-4 px-4 pb-4 sm:pt-8 pt-4">
    <div class="sm:w-1/3 md:w-1/2 px-6 text-center sm:pt-16 md:pt-0">
      <h1 class="sm:text-7xl md:text-9xl text-5xl __logo cursor-default">Y</h1>
    </div>
    <div class="w-10/12 sm:w-2/3 md:w-1/2 py-10 sm:px-6 mx-auto">
      <h1 class="text-5xl font-bold tracking-wide">Happening now</h1>
      <div class="sm:w-full md:w-3/4 xl:w-3/5">
        <p class="text-3xl font-bold mt-10 tracking-wide">Join today.</p>
        <div>
          <button
            class="flex justify-center bg-white mt-5 space-x-2 hover:bg-gray-100 py-2 w-full font-semibold text text-black rounded-full"
          >
            <img
              class="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span @click="googleAuth">Sign in with Google</span>
          </button>
        </div>
        <hr class="h-px my-4 bg-gray-600 border-0" />
        <div>
          <button
            class="bg-sky-500 hover:bg-sky-600 font-semibold py-2 w-full rounded-full"
            @click="showSignUpModal = true"
          >
            Create account
          </button>
          <div class="text-xs mt-1 text-gray-500">
            By signing up, you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
          </div>
        </div>
        <div class="mt-12">
          <p class="text-lg mt-10 font-semibold tracking-wide">
            Already have an account?
          </p>
          <button
            class="border border-gray-300 focus:outline-none hover:bg-gray-900 focus:ring-4 focus:ring-gray-200 mt-5 font-bold py-2 w-full rounded-full text-sky-500"
            @click="showLogInModal = true"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
    <RegisterModal
      :showSignUpModal="showSignUpModal"
      @close-modal="closeSignUpModal"
      @emit-error="emitError"
    ></RegisterModal>
    <LoginModal
      :showLogInModal="showLogInModal"
      @close-modal="closeLogInModal"
      @emit-error="emitError"
    ></LoginModal>
  </div>
</template>

<script>
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";

export default {
  name: "AuthenticationPage",
  components: {
    RegisterModal,
    LoginModal,
  },
  data() {
    return {
      showSignUpModal: false,
      showLogInModal: false,
    };
  },
  mounted() {
    if (this.isLogged) {
      this.$router.push("/");
    }
  },

  computed: {
    ...mapGetters("user", ["isLogged"]),
  },
  methods: {
    closeSignUpModal() {
      this.showSignUpModal = false;
    },
    closeLogInModal() {
      this.showLogInModal = false;
    },

    emitError(error) {
      Swal.fire({
        toast: true,
        title: error.response.data.message,
        animation: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        background: "#1d9bf0",
        color: "white",
        timerProgressBar: false,
        padding: "0.5em 0 0.5em",
      });
    },

    googleAuth() {
      googleSdkLoaded((google) => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: process.env.VUE_APP_CLIENT_ID,
            scope: "email profile openid",
            redirect_uri: process.env.VUE_APP_REDIRECT_URL,
            callback: (response) => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            },
          })
          .requestCode();
      });
    },
    async sendCodeToBackend(code) {
      try {
        const headers = {
          Authorization: code,
        };
        await axios
          .get("http://localhost:3000/auth/google", { headers })
          .then(async (response) => {
            const userDetails = response.data;
            console.log("User Details:", userDetails);
            await this.$store.dispatch("user/logIn", {
              user: response.data.user.user,
              jwt: response.data.user.token,
            });
            this.$router.push("/");
          })
          .catch((error) => {
            console.log("error ", error);
            this.emitError(error);
          });
      } catch (error) {
        console.error("Failed to send authorization code:", error);
      }
    },
  },
};
</script>

<style scoped>
.__logo {
  font-weight: 600;
}
</style>
