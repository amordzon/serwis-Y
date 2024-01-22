import axios from "axios";

const UserService = {
  async getUserInfo(username, jwt) {
    const response = await axios.get("/users/user/" + username, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async getUserTweets(url, jwt) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async editUserDetails(data, jwt) {
    const response = await axios.put("/users/", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "content-type": "multipart/form-data",
      },
    });
    return response;
  },
  async followUnfollow(userID, jwt) {
    const response = await axios.patch(
      "/users/follow",
      {
        userToFollow: userID,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  },
  async getOurBlockedUsers(jwt) {
    const response = await axios.get("/users/blocked/", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async blockUnblock(userID, jwt) {
    const response = await axios.patch(
      "/users/block",
      {
        userToBlock: userID,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  },
};

export default UserService;
