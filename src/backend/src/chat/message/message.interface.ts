import { UserI } from '../../user/user.interface';
import { RoomI } from '../rooms/room.interface';


export interface MessageI {
  id?: number;
  text: string;
  user: UserI;
  room: RoomI;
  created_at: Date;
  updated_at: Date;
}