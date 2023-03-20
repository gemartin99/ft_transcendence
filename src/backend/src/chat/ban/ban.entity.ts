import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../rooms/room.entity";

@Entity()
export class BanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  room_id: number;

  @Column()
  ban_expires: Date;
}
