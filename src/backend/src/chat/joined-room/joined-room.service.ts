import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from './joined-room.entity';
import { JoinedRoomI } from './joined-room.interface';
import { RoomI } from '../rooms/room.interface';
import { UserI } from '../../user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {

  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>
  ) { }

  async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> { 
    // console.log('Inisde this.joinedRoomService.create');
    // console.log('joinedRoom is:');
    // console.log(joinedRoom);
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async join(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
    //console.log('Inside this.joinedRoomService.create');
    //console.log('joinedRoom is:');
    //console.log(joinedRoom);

    // const newJoinedRoom = new JoinedRoomEntity();
    // newJoinedRoom.socketId = joinedRoom.socketId;
    // newJoinedRoom.user = joinedRoom.user;
    // newJoinedRoom.room = joinedRoom.room;
    return await this.joinedRoomRepository.save(joinedRoom);
    // const savedJoinedRoom = await this.joinedRoomRepository.save(newJoinedRoom);
    // return savedJoinedRoom;
  }

  async remove(joinedRoom: JoinedRoomI): Promise<void> {
    await this.joinedRoomRepository.delete(joinedRoom.id);
  }


  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    return await this.joinedRoomRepository.find({ where: { user }});
  }

  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    //console.log('In findByRoom(room: RoomI): Promise<JoinedRoomI[]>');
    //console.log('Room is');
    //console.log(room);
    return await this.joinedRoomRepository.find({ where: { room: { id: room.id } } });
  }

  async findByRoomExcludingBlockedUser(room: RoomI, id_blocked_user: number): Promise<JoinedRoomI[]> {
    return this.joinedRoomRepository
      .createQueryBuilder("joinedRoom")
      .leftJoinAndSelect("joinedRoom.user", "user")
      .leftJoinAndSelect("user.blocked_users", "blocked_users")
      .where("joinedRoom.room = :roomId", { roomId: room.id })
      .getMany();
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }


  async deleteAll() {
    await this.joinedRoomRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
