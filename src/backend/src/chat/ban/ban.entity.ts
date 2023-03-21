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

  @Column({ nullable: true })
  ban_expires: Date;

  @Column({ nullable: true })
  mute_expires: Date;
}
