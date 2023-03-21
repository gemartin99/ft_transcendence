import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RoomEntity } from './room.entity';
import { RoomI } from './room.interface';
import { UserI } from '../../user/user.interface';
import { Repository } from 'typeorm';
import { Socket, Server } from 'socket.io';
import { JoinedRoomService } from '../joined-room/joined-room.service';
import { OwnerService } from '../owner/owner.service';
import { OperatorService } from '../operator/operator.service';
import { UserService } from '../../user/user.service';
import { BanService } from '../ban/ban.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {


  constructor(
    private joinedRoomService: JoinedRoomService,
    private ownerService: OwnerService,
    private operatorService: OperatorService,
    private userService: UserService,
    private banService: BanService,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) { }

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    //const newRoom = await this.addCreatorToRoom(room, creator);
    console.log('createRoom:');
    if(room.password != null && room.password != '')
    {
      console.log('createRoom: passsword is set');
      room.password = await bcrypt.hash(room.password, 10);
    }
    console.log(room);
    room.users = [{ id: creator.id }];
    if(room.type == 1)
    {
      console.log('createRoom: room is public');
    }
    else if(room.type == 2)
    {
      console.log('createRoom: room is private');
    }
    else
    {
      console.log('createRoom: room is not 1 or 2');
    }
    const created_room = await this.roomRepository.save(room);
    await this.ownerService.addOwner(creator.id, created_room.id);
    return created_room;
  }

  async joinRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    const newRoom = await this.getRoomByName(room.name);
    if(newRoom)
    {
      console.log('In room service');
      console.log('joiner is:');
      console.log(creator);
      console.log('joinroom is:');
      console.log(newRoom);
      newRoom.users.push(creator);
      return this.roomRepository.save(newRoom);
    }
    else
    {
      console.log('Room not found');
      return null;
    }
  }

  async joinRoomById(room: RoomI, creator: UserI): Promise<RoomI> {
    const newRoom = await this.getRoomById(room.id);
    if(newRoom)
    {
      console.log('In room service');
      console.log('joiner is:');
      console.log(creator);
      console.log('joinroom is:');
      console.log(newRoom);
      newRoom.users.push(creator);
      return this.roomRepository.save(newRoom);
    }
    else
    {
      console.log('Room not found');
      return null;
    }
  }

  async getAllRooms(options: IPaginationOptions): Promise<Pagination<RoomI>> {
      const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .select(['room', 'user.id', 'user.name'])
      return paginate(query, options);
  }

  async getPublicRooms(): Promise<RoomI[]> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .select(['room', 'user.id', 'user.name'])
      .where('room.type = :type', { type: 1 });

    const rooms = await query.getMany();
    return rooms;
  }

  async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
    const query = this.roomRepository
    .createQueryBuilder('room')
    .leftJoin('room.users', 'user')
    .where('user.id = :userId', {userId})
    .leftJoin('room.users', 'all_users')
    .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  async getRoomByName(name: string): Promise<RoomI> {
    const room = await this.roomRepository.findOne({
      where: { name: name },
      relations: ['users'],
    });
    return room;
  }

  async getRoomById(id: number): Promise<RoomI> {
    const room = await this.roomRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });
    return room;
  }

  async getRoomByIdWhitNoUsersRelation(id: number): Promise<RoomI> {
    const room = await this.roomRepository.findOne({
      where: { id: id },
    });
    return room;
  }

  async getRoom(roomId: number): Promise<RoomI> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  async createGeneralRoom(): Promise<RoomI> {
    const generalRoom = new RoomEntity();
    generalRoom.name = "General";
    generalRoom.type = 1;
    return this.roomRepository.save(generalRoom);
  }

  async JoinUserToGeneralRoom(user: UserI, socket: Socket): Promise<RoomI> {
    const room: RoomI = await this.getRoomByName("General");
    if(room)
    {
       await this.joinRoom(room, user);
       await this.joinedRoomService.join({ socketId: socket.id, user, room });
    }
    return null;
  }

  async userCloseChannel(client: UserI, roomID: number): Promise<RoomI> {
    const room: RoomI = await this.getRoomById(roomID);
    if(room)
    {
      room.users = room.users.filter(user => user.id != client.id);
      await this.roomRepository.save(room);
      return(room);
    }
    return null;
  }

  async checkRoomPassword(roomPass: string, inputPass: string) {
    if(!inputPass)
      return false;
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(inputPass)) {
      return false;
    }

    if (await bcrypt.compare(inputPass, roomPass)) {
      return true;
    }
    return false;
  }

  async kick_user_from_channel(channelId: number, userId: number) {
    const channel = await this.roomRepository.findOne({
      where: { id: channelId },
      relations: ["joinedUsers", "users"],
    });
    if(!channel)
      return;

    const joinedUser = channel.joinedUsers.find(joinedUser => joinedUser.user.id === userId);
    if (!joinedUser) {
      throw new Error("User is not joined in the channel");
    }

    // Remove the joined user from the channel's joinedUsers array
    await this.joinedRoomService.remove(joinedUser);

    // Remove the user from the channel's users array
    channel.users = channel.users.filter(user => user.id !== userId);
    await this.roomRepository.save(channel);
  }

  async isUserBanedFromChannel(roomId: number, userId: number): Promise<boolean>
  {
      return(await this.banService.isUserBannedFromRoom(roomId, userId));
  }

  async isUserMutedFromChannel(roomId: number, userId: number): Promise<boolean>
  {
      return(await this.banService.isUserMutedFromRoom(roomId, userId));
  }

  //CHAT COMMANDS
  async opBanUserFromRoom(room: RoomI, user: UserI, userTargetName: string) {
    const target_room = await this.getRoomByIdWhitNoUsersRelation(room.id);
    if(!target_room){
      //room not found
      return 1;
    }
    const regex = /^[A-Za-z0-9]{1,30}$/;
    if (!regex.test(userTargetName)) {
      return 2;
    }

    const target = await this.userService.getByName(userTargetName);
    if(!target)
      return 3;

    if(await this.ownerService.isOwner(user.id, room.id))
    {
      await this.banService.banUserFromRoom(target_room.id, target, 5);
      await this.kick_user_from_channel(target_room.id, user.id);
      //console.log('user is owner, and wants to ban');
      return 0;
    }
    else if(await this.operatorService.isOperator(user.id, room.id))
    {
      if(await this.ownerService.isOwner(target.id, room.id))
      {
         //console.log('user owner cant be banned');
        return 5;
      }
      await this.banService.banUserFromRoom(target_room.id, target, 5);
      await this.kick_user_from_channel(target_room.id, user.id);
      //console.log('user is operator, and wants to ban');
      return 0;
    }
    else
    {
      //console.log('user is not operator, and wants to ban');
      return 4
    }
  }

  async opMuteUserFromRoom(room: RoomI, user: UserI, userTargetName: string) {
    const target_room = await this.getRoomByIdWhitNoUsersRelation(room.id);
    if(!target_room){
      //room not found
      return 1;
    }

    const regex = /^[A-Za-z0-9]{1,30}$/;
    if (!regex.test(userTargetName)) {
      return 2;
    }

    const target = await this.userService.getByName(userTargetName);
    if(!target)
      return 3;

    if(await this.ownerService.isOwner(user.id, room.id))
    {
      await this.banService.muteUserFromRoom(target_room.id, target, 5);
      //console.log('user is owner, and wants to ban');
      return 0;
    }
    else if(await this.operatorService.isOperator(user.id, room.id))
    {
      if(await this.ownerService.isOwner(target.id, room.id))
      {
         //console.log('user owner cant be banned');
        return 5;
      }
      await this.banService.muteUserFromRoom(target_room.id, target, 5);
      //console.log('user is operator, and wants to ban');
      return 0;
    }
    else
    {
      //console.log('user is not operator, and wants to ban');
      return 4
    }
  }

  async owChangePasswordRoom(room: RoomI, user: UserI, password: string) {
    const regex = /^[A-Za-z0-9]{1,30}$/;
    if (!regex.test(password)) {
      return 2;
    }
    if (await this.ownerService.isOwner(user.id, room.id)) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      room.password = hash;
      await this.roomRepository.save(room);
    } else {
      //console.log('user is not owner, he can\'t change the password');
      return 1;
    }
    return 0;
  }

  async owUnsetPasswordRoom(room: RoomI, user: UserI) {
    const target_room = await this.getRoomByIdWhitNoUsersRelation(room.id);
    if(!target_room){
      //room not found
      return 1;
    }
      //console.log('Room service unset password of the room');

    if(await this.ownerService.isOwner(user.id, target_room.id))
    {
      //user is owner, the password is unseted
      //console.log('user is owner, the password is unseted');
      target_room.password = null;
      await this.roomRepository.save(target_room);
      return 0;
    }
    else
    {
      //console.log('user is not owner, he can t unset the password');
      return 2;
    }
    return 0;
  }

  async owSetUserAsOperator(room: RoomI, user: UserI, userTargetName: string) {
    const target_room = await this.getRoomByIdWhitNoUsersRelation(room.id);
    if(!target_room){
      //room not found
      return 1;
    }

    const regex = /^[A-Za-z0-9]{1,30}$/;
    if (!regex.test(userTargetName)) {
      return 3;
    }

    console.log('Room service promote user as operator');
    if(await this.ownerService.isOwner(user.id, target_room.id))
    {
      console.log('user is owner, try promoting user to operator');
      const target = await this.userService.getByName(userTargetName);
      if(target)
      {
        await this.operatorService.addOperator(target.id, target_room.id);
        console.log('user promoted to oeprator');
        return 0;
      }
      else
      {
        console.log('target user not found');
        return 3;
      }
    }
    else
    {
      console.log('user is not owner, he can t promote to operator');
      return 2;
    }
    return 0;
  }

  async owUnsetUserAsOperator(room: RoomI, user: UserI, userTargetName: string) {
    const target_room = await this.getRoomByIdWhitNoUsersRelation(room.id);
    if(!target_room){
      //room not found
      return 1;
    }

    const regex = /^[A-Za-z0-9]{1,30}$/;
    if (!regex.test(userTargetName)) {
      return 3;
    }

    console.log('Room service try to degrade user as operator');
    if(await this.ownerService.isOwner(user.id, target_room.id))
    {
      console.log('user is owner, try degrade user as operator');
      const target = await this.userService.getByName(userTargetName);
      if(target)
      {
        this.operatorService.removeOperator(target.id, target_room.id);
        console.log('user removed from operators');
        return 0;
      }
      else
      {
        console.log('target user not found');
        return 3;
      }
    }
    else
    {
      console.log('user is not owner, he can t degrade operators');
      return 2
    }
    return 0;
  }

  //TODO check if user is in room
  async usJoinRoom(user: UserI, roomName: string, roomPass: string) {
    const newRoom = await this.getRoomByName(roomName);
    if(!newRoom)
      return(null);
    if(roomPass == "" || newRoom.password == null)
    {
        newRoom.users.push(user);
        return this.roomRepository.save(newRoom);
    }
    else
    {
        if (await bcrypt.compare(roomPass, newRoom.password)) {
            newRoom.users.push(user);
            return this.roomRepository.save(newRoom);
        }
    }
  }

  async preparePvtMessageRoom(user1: UserI, user2: UserI): Promise<RoomI> {

    //Reorder the users for minor id first, bigger id last
    if(user1.id > user2.id)
    {
        const tmp_user = user1;
        user1 = user2;
        user2 = tmp_user;
    }
    
    const room = await this.roomRepository
        .createQueryBuilder("room")
        .where("room.type = :type", { type: 3 })
        .andWhere("room.id_pvt_user1 = :user1Id", { user1Id: user1.id })
        .andWhere("room.id_pvt_user2 = :user2Id", { user2Id: user2.id })
        .getOne();

    if(room)
      return room;

    //If room not exist we create one
    return await this.createPvtMessageRoom(user1, user2);
  }

  async createPvtMessageRoom(user1: UserI, user2: UserI): Promise<RoomI> {
      const room: RoomI = {
          name: `Pvtmsg: ${user1.name} | ${user2.name}`,
          password: null,
          type: 3,
          users: [{ id: user1.id }, { id: user2.id }],
          id_pvt_user1: user1.id,
          id_pvt_user2: user2.id
      };
      console.log(room);
      const created_room = await this.roomRepository.save(room);
      return created_room;
  }
}
