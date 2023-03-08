export interface UserI {
  id?: number;
  name?: string;
  avatar?: string;
  reg_completed?: boolean;
  twofactor?: boolean;
  twofactor_valid?: boolean;
  score?: number;
  played?: number;
  wins?: number;
  losses?: number;
}