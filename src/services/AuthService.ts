import Http from "@/config/http";
import type { LoginForm, LoginResponse, User } from "@/types";

export default {
  async login(data: LoginForm) {
    return Http.post<LoginResponse>("/login", data);
  },

  async user() {
    return Http.get<{ data: User }>("/user");
  },

  async logout() {
    return Http.post("/logout");
  },
};
