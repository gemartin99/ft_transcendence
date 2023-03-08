import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from './message.entity';
import { MessageI } from './message.interface';
import { RoomI } from '../rooms/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(room: RoomI, options: IPaginationOptions): Promise<Pagination<MessageI>> {
    return paginate(this.messageRepository, options, {
      room,
      relations: ['user', 'room']
    });
  }

}