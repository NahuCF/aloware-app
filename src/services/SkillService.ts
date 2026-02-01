import Http from "@/config/http";
import type { Skill } from "@/types";

export default {
  async index() {
    return Http.get<{ data: Skill[] }>("/skills");
  },
};
