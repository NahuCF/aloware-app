export interface Line {
  id: number;
  name: string;
  phone_number: string;
  ivr_steps: IvrStep[] | null;
}

export interface IvrContext {
  language_id?: number;
  skill_ids?: number[];
}

export interface IvrStep {
  digit: string;
  label: string;
  action_type: "menu" | "route_to_skill" | "route_to_user" | "route_to_line";
  target_id?: number;
  context?: IvrContext;
  sub_steps?: IvrStep[];
}
