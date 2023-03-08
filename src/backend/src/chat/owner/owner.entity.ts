import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../rooms/room.entity";

@Entity()
export class OwnerEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.owners)
  @JoinColumn()
  user: User;

  @ManyToOne(() => RoomEntity, room => room.owners)
  @JoinColumn()
  room: RoomEntity;
}
