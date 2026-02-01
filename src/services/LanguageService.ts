import Http from "@/config/http";
import type { Language } from "@/types";

export default {
  async index() {
    return Http.get<{ data: Language[] }>("/languages");
  },
};
