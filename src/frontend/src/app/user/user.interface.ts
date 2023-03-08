export interface UserI {
  id?: number;
  name?: string;
  avatar?: string;
  reg_completed?: boolean;
  twofactor?: boolean;
  twofactor_valid?: boolean;
  is_online?: boolean;
  score?: number;
  played?: number;
  wins?: number;
  losses?: number;
}