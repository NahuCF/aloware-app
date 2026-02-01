import AuthService from "@/services/AuthService";
import LineService from "@/services/LineService";
import UserService from "@/services/UserService";
import LanguageService from "@/services/LanguageService";
import SkillService from "@/services/SkillService";
import Http from "@/config/http";

export const API = {
  auth: AuthService,
  line: LineService,
  user: UserService,
  language: LanguageService,
  skill: SkillService,
  http: Http,
};
