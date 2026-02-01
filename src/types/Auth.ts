import type { User } from "./User";

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: User;
  meta: {
    token: string;
  };
}
