import Http from "@/config/http";

export default {
  getToken() {
    return Http.get("/voice/token");
  },
};
