import Http from "@/config/http";

export default {
  index() {
    return Http.get("/sms");
  },

  send(data: { to: string; body: string }) {
    return Http.post("/sms", data);
  },
};
