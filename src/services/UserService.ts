import Http from "@/config/http";
import type { User, PaginatedResponse } from "@/types";

export default {
  async index(page = 1) {
    return Http.get<PaginatedResponse<User>>("/users", { params: { page } });
  },

  async show(id: number) {
    return Http.get<{ data: User }>(`/users/${id}`);
  },

  async store(data: Partial<User> & { password?: string }) {
    return Http.post<{ data: User }>("/users", data);
  },

  async update(id: number, data: Partial<User>) {
    return Http.put<{ data: User }>(`/users/${id}`, data);
  },

  async destroy(id: number) {
    return Http.delete(`/users/${id}`);
  },
};
