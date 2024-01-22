import axios from "axios";

const PostService = {
  async postSubmission(reqBody, jwt) {
    const response = await axios.post("/posts", reqBody, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "content-type": "multipart/form-data",
      },
    });
    return response;
  },
  async getPosts(url, jwt) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async getPost(postID, jwt) {
    const response = await axios.get("/posts/post/" + postID, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async getPostComm(url, jwt) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
  async getPostAncestors(url, jwt) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  },
};

export default PostService;
