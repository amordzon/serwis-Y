import axios from "axios";
import { googleSdkLoaded } from "vue3-google-login";

const AuthService = {
  initGoogleAuth(clientId, redirectUrl, callback) {
    googleSdkLoaded((google) => {
      google.accounts.oauth2
        .initCodeClient({
          client_id: clientId,
          scope: "email profile openid",
          redirect_uri: redirectUrl,
          callback,
        })
        .requestCode();
    });
  },

  async sendGoogleCodeToBackend(code) {
    const headers = {
      Authorization: code,
    };
    const response = await axios.get("/auth/google", {
      headers,
    });
    return response;
  },

  async LoginSubmission(form) {
    const response = await axios.post("/auth/login", form);
    return response;
  },

  async RegisterSubmisssion(form) {
    const response = await axios.post("/auth/register", form);
    return response;
  },
};

export default AuthService;
