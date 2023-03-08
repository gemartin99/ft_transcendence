import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { JoinedRoomEntity } from "../chat/joined-room/joined-room.entity";
import { MessageEntity } from "../chat/message/message.entity";
import { RoomEntity } from "../chat/rooms/room.entity";
import { OnlineUserEntity } from "../onlineuser/onlineuser.entity";
import { OperatorEntity } from "../chat/operator/operator.entity";
import { OwnerEntity } from "../chat/owner/owner.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, unique: true})
  name: string;

  @Column({unique: true})
  id42: number;

  @Column({ default: false })
  twofactor: boolean

  @Column({ default: false })
  twofactor_valid: boolean

  @Column({ default: false })
  reg_completed: boolean

  @Column({ default: true })
  is_online: boolean

  @Column({ default: 0 })
  is_playing: number

  @Column({default: 0})
  score: number;

  @Column({default: 0})
  played: number;

  @Column({default: 0})
  wins: number;

  @Column({default: 0})
  losses: number;

  @Column({nullable: true})
  avatar: string;

  @Column({ default: 0 })
  game_options: number

  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[];

  @ManyToMany(() => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @OneToMany(() => OnlineUserEntity, connection => connection.user)
  connections: OnlineUserEntity[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => OperatorEntity, operator => operator.room)
  operators: OperatorEntity[];

  @OneToMany(() => OwnerEntity, owner => owner.room)
  owners: OwnerEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];
}
