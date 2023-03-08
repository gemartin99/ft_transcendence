import { UserI } from "../../user/user.interface";
import { RoomI } from "../rooms/room.interface";


export interface OperatorI {
  id?: number;
  user: UserI;
  room: RoomI;
}