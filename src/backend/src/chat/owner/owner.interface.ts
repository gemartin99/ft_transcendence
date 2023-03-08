import { UserI } from "../../user/user.interface";
import { RoomI } from "../rooms/room.interface";


export interface OwnerI {
  id?: number;
  user: UserI;
  room: RoomI;
}