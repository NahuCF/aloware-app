export interface User {
  id: number;
  name: string;
  email: string;
  languages: Language[];
  skills: Skill[];
}

export interface Language {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}
