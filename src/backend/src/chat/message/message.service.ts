import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from './message.entity';
import { MessageI } from './message.interface';
import { RoomI } from '../rooms/room.interface';
import { Repository } from 'typeorm';
import { RoomService } from '../rooms/room.service';
import { UserService } from '../../user/user.service';
import { In } from 'typeorm';

@Injectable()
export class MessageService {


  constructor(
    private roomService: RoomService,
    private userService: UserService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(room: RoomI, options: IPaginationOptions): Promise<Pagination<MessageI>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC');

    return paginate(query, options);
  }
}