import { UserI } from "../../user/user.interface";
import { RoomI } from "../rooms/room.interface";


export interface JoinedRoomI {
  id?: number;
  socketId: string;
  user: UserI;
  room: RoomI;
}