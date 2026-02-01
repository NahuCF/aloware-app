import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import LanguageService from "@/services/LanguageService";
import SkillService from "@/services/SkillService";
import Http from "@/config/http";

export const API = {
  auth: AuthService,
  user: UserService,
  language: LanguageService,
  skill: SkillService,
  http: Http,
};
