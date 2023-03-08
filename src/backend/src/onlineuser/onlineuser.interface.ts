import { UserI } from "../user/user.interface";


export interface OnlineUserI {
  id?: number;
  socketId: string;
  user: UserI;
}