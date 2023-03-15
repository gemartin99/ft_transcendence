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

// async findMessagesForRoomExcludingBlockedUsers(clientId: number, room: RoomI, options: IPaginationOptions): Promise<Pagination<MessageI>> {   
//   const blocked_users = await this.userService.findBlockedUsers(clientId);

//   const query = this.messageRepository
//     .createQueryBuilder('message')
//     .leftJoin('message.room', 'room')
//     .where('room.id = :roomId', { roomId: room.id })
//     .andWhere('message.user NOT IN (:...blockedUserIds)', { blockedUserIds: blocked_users.map(user => user.id) })
//     .leftJoinAndSelect('message.user', 'user')
//     .orderBy('message.created_at', 'DESC');

//   return paginate(query, options);
// }

  async processCommand(message: MessageI) {
    if (message.text.startsWith('/')) {
      const [command, ...args] = message.text.split(' ');
      switch (command) {
        case '/msg':
          console.log('The message is a CMD (private msj)');
          break;
        case '/ban':
          if (args.length == 1) {
            await this.roomService.opBanUserFromRoom(message.room, message.user, args[0]);
            return;
          }
          break;
        case '/mute':
          if (args.length == 1) {
            await this.roomService.opMuteUserFromRoom(message.room, args[0]);
            return;
          }
          break;
        case '/setpwd':
          if (args.length == 1) {
            await this.roomService.owChangePasswordRoom(message.room, message.user, args[0]);
            return;
          }
          break;
        case '/unsetpwd':
            await this.roomService.owUnsetPasswordRoom(message.room, message.user);
            return;
          break;
        case '/setop':
          if (args.length == 1) {
            await this.roomService.owSetUserAsOperator(message.room, message.user, args[0]);
            return;
          }
          break;
        case '/unsetop':
          if (args.length == 1) {
            await this.roomService.owUnsetUserAsOperator(message.room, message.user, args[0]);
            return;
          }
          break;
        case '/join':
          if (args.length == 1) {
            await this.roomService.usJoinRoom(message.user, args[0], "");
            return;
          }
          if (args.length == 2) {
            await this.roomService.usJoinRoom(message.user, args[0], args[1]);
            return;
          }
          break;
        default:
          // handle unknown command
          break;
      }
    }
  }
}