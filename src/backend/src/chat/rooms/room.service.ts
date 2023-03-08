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
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {


  constructor(
    private joinedRoomService: JoinedRoomService,
    private ownerService: OwnerService,
    private operatorService: OperatorService,
    private userService: UserService,
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

  //CHAT COMMANDS
  async opBanUserFromRoom(room: RoomI, user: UserI, userTargetName: string) {
    console.log('Room service Ban User from room');
    console.log(room);
    if(await this.operatorService.isOperator(user.id, room.id))
    {
      console.log('user is operator, and wants to ban');
    }
    else
    {
      console.log('user is not operator, and wants to ban');
    }
  }

  async opMuteUserFromRoom(room: RoomI, username: string) {
    console.log('Room service Ban User from room');
    console.log(room);
  }

  async owChangePasswordRoom(room: RoomI, user: UserI, password: string) {
    console.log('cambiar password');
    console.log('Room service change password of the room');
    if (await this.ownerService.isOwner(user.id, room.id)) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      room.password = hash;
      await this.roomRepository.save(room);
    } else {
      console.log('user is not owner, he can\'t change the password');
    }
  }

  async owUnsetPasswordRoom(room: RoomI, user: UserI) {
    console.log('Room service unset password of the room');
    if(await this.ownerService.isOwner(user.id, room.id))
    {
      console.log('user is owner, the password is unseted');
      room.password = null;
      await this.roomRepository.save(room);
    }
    else
    {
      console.log('user is not owner, he can t unset the password');
    }
  }

  async owSetUserAsOperator(room: RoomI, user: UserI, userTargetName: string) {
    console.log('Room service promote user as operator');
    if(await this.ownerService.isOwner(user.id, room.id))
    {
      console.log('user is owner, try promoting user to operator');
      const target = await this.userService.getByName(userTargetName);
      if(target)
      {
        this.operatorService.addOperator(target.id, room.id);
        console.log('user promoted to oeprator');
      }
      else
      {
        console.log('target user not found');
      }
    }
    else
    {
      console.log('user is not owner, he can t promote to operator');
    }
  }

  async owUnsetUserAsOperator(room: RoomI, user: UserI, userTargetName: string) {
    console.log('Room service try to degrade user as operator');
    if(await this.ownerService.isOwner(user.id, room.id))
    {
      console.log('user is owner, try degrade user as operator');
      const target = await this.userService.getByName(userTargetName);
      if(target)
      {
        this.operatorService.removeOperator(target.id, room.id);
        console.log('user removed from operators');
      }
      else
      {
        console.log('target user not found');
      }
    }
    else
    {
      console.log('user is not owner, he can t degrade operators');
    }
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
}
