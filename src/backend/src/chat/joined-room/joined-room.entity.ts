import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../rooms/room.entity";

@Entity()
export class JoinedRoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => User, user => user.joinedRooms)
  @JoinColumn()
  user: User;

  @ManyToOne(() => RoomEntity, room => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;

}