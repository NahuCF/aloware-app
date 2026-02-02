import AuthService from "@/services/AuthService";
import LineService from "@/services/LineService";
import UserService from "@/services/UserService";
import LanguageService from "@/services/LanguageService";
import SkillService from "@/services/SkillService";
import VoiceService from "@/services/VoiceService";
import Http from "@/config/http";

export const API = {
  auth: AuthService,
  line: LineService,
  user: UserService,
  language: LanguageService,
  skill: SkillService,
  voice: VoiceService,
  http: Http,
};
