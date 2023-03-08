import { User } from "../../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { JoinedRoomEntity } from "../joined-room/joined-room.entity";
import { MessageEntity } from "../message/message.entity";

@Entity()
export class RoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  password: string;

  @Column()
  type: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.room)
  messages: MessageEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}