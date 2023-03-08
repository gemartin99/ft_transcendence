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
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    return this.joinedRoomRepository.find({ where: { user }});
  }

  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    return this.joinedRoomRepository.find({ where: { room }});
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
