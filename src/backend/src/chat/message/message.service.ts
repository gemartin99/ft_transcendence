import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from './message.entity';
import { MessageI } from './message.interface';
import { RoomI } from '../rooms/room.interface';
import { Repository } from 'typeorm';
import { RoomService } from '../rooms/room.service';

@Injectable()
export class MessageService {


  constructor(
    private roomService: RoomService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    if (message.text.startsWith('/')) {
      this.processCommand(message);
      return null;
    }
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

  async processCommand(message: MessageI) {
    if (message.text.startsWith('/')) {
      const [command, ...args] = message.text.split(' ');
      switch (command) {
        case '/msg':
          console.log('The message is a CMD (private msj)');
          break;
        case '/ban':
          if (args.length == 1) {
            await this.roomService.opBanUserFromRoom(message.room, args[0]);
            return;
          }
          break;
        case '/mute':
          if (args.length == 1) {
            await this.roomService.opMuteUserFromRoom(message.room, args[0]);
            return;
          }
          break;
        case '/setpwd:':
          if (args.length == 1) {
            await this.roomService.owChangePasswordRoom(message.room, message.user, args[0]);
            return;
          }
          break;
        case '/unsetpwd:':
            await this.roomService.owUnsetPasswordRoom(message.room, message.user);
            return;
          break;
        case '/setop':
          console.log('The message is a CMD (mode)');
          break;
        case '/unsetop':
          console.log('The message is a CMD (mode)');
          break;
        default:
          // handle unknown command
          break;
      }
    }
  }
}