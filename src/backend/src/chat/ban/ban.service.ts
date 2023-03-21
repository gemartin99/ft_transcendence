import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BanEntity } from './ban.entity';
import { User } from '../../user/user.entity';
import { RoomEntity } from '../rooms/room.entity';

@Injectable()
export class BanService {
  constructor(
    @InjectRepository(BanEntity)
    private readonly banRepository: Repository<BanEntity>,
  ) {}

  async banUserFromRoom(room_id: number, user: User, banDurationMinutes: number): Promise<BanEntity> {
    const banExpiry = new Date(Date.now() + banDurationMinutes * 60000);

    const existingBan = await this.banRepository.findOne({
      where: { user_id: user.id, room_id: room_id },
    });

    if (existingBan) {
      existingBan.ban_expires = banExpiry;
      return await this.banRepository.save(existingBan);
    } else {
      const ban = new BanEntity();
      ban.user_id = user.id;
      ban.room_id = room_id;
      ban.ban_expires = banExpiry;
      return await this.banRepository.save(ban);
    }
  }

  async unbanUserFromRoom(room: RoomEntity, user: User): Promise<void> {
    const existingBan = await this.banRepository.findOne({
      where: { user_id: user.id, room_id: room.id },
    });

    if (existingBan) {
      await this.banRepository.delete(existingBan.id);
    }
  }

  async isUserBannedFromRoom(roomId: number, userId: number): Promise<boolean> {
    const ban = await this.banRepository.findOne({
      where: { user_id: userId, room_id: roomId },
    });

    return !!ban && ban.ban_expires > new Date();
  }

  async muteUserFromRoom(room_id: number, user: User, muteDurationMinutes: number): Promise<BanEntity> {
    const muteExpiry = new Date(Date.now() + muteDurationMinutes * 60000);

    const existingBan = await this.banRepository.findOne({
      where: { user_id: user.id, room_id: room_id },
    });

    if (existingBan) {
      existingBan.mute_expires = muteExpiry;
      return await this.banRepository.save(existingBan);
    } else {
      const ban = new BanEntity();
      ban.user_id = user.id;
      ban.room_id = room_id;
      ban.mute_expires = muteExpiry;
      return await this.banRepository.save(ban);
    }
  }

  async unmuteUserFromRoom(room: RoomEntity, user: User): Promise<void> {
    const existingBan = await this.banRepository.findOne({
      where: { user_id: user.id, room_id: room.id },
    });

    if (existingBan) {
      existingBan.mute_expires = null;
      await this.banRepository.save(existingBan);
    }
  }

  async isUserMutedFromRoom(roomId: number, userId: number): Promise<boolean> {
    const ban = await this.banRepository.findOne({
      where: { user_id: userId, room_id: roomId },
    });

    return !!ban && ban.mute_expires > new Date();
  }
}