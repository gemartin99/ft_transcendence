import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../rooms/room.entity";

@Entity()
export class OperatorEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.operators)
  @JoinColumn()
  user: User;

  @ManyToOne(() => RoomEntity, room => room.operators)
  @JoinColumn()
  room: RoomEntity;
}
