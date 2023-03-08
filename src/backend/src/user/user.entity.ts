import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { JoinedRoomEntity } from "../chat/joined-room/joined-room.entity";
import { MessageEntity } from "../chat/message/message.entity";
import { RoomEntity } from "../chat/rooms/room.entity";
import { OnlineUserEntity } from "../onlineuser/onlineuser.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, unique: true})
  name: string;

  @Column({nullable: false})
  password: string;

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

  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[];

  @ManyToMany(() => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @OneToMany(() => OnlineUserEntity, connection => connection.user)
  connections: OnlineUserEntity[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];
}

// import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
// import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
// import { MessageEntity } from "src/chat/model/message/message.entity";
// import { RoomEntity } from "src/chat/model/room/room.entity";
// import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class UserEntity {

//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({unique: true})
//   username: string;

//   @Column({unique: true})
//   email: string;

//   @Column({select: false})
//   password: string;

//   @ManyToMany(() => RoomEntity, room => room.users)
//   rooms: RoomEntity[]

//   @OneToMany(() => ConnectedUserEntity, connection => connection.user)
//   connections: ConnectedUserEntity[];

//   @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
//   joinedRooms: JoinedRoomEntity[];

//   @OneToMany(() => MessageEntity, message => message.user)
//   messages: MessageEntity[];

//   @BeforeInsert()
//   @BeforeUpdate()
//   emailToLowerCase() {
//     this.email = this.email.toLowerCase();
//     this.username = this.username.toLowerCase();
//   }

// }