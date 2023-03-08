import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RoomEntity } from './room.entity';
import { RoomI } from './room.interface';
import { UserI } from '../../user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {


  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) { }

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    //const newRoom = await this.addCreatorToRoom(room, creator);
    console.log('createRoom:');
    console.log(room);
    room.users = [{ id: creator.id }];
    room.type = 1;
    return this.roomRepository.save(room);
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

  async getAllRooms(options: IPaginationOptions): Promise<Pagination<RoomI>> {
      const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .select(['room', 'user.id', 'user.name'])
      return paginate(query, options);
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

  async getRoom(roomId: number): Promise<RoomI> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }


  // async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
  //   room.users.push(creator);
  //   console.log('addCreatorToRoom:');
  //   console.log(room);
  //   return room;
  // }

}
