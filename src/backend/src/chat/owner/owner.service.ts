import { Injectable } from '@nestjs/common';
import { OwnerEntity } from './owner.entity';
import { OwnerI } from './owner.interface';
import { RoomI } from '../rooms/room.interface';
import { RoomEntity } from '../rooms/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';

@Injectable()
export class OwnerService {

	constructor(
	  @InjectRepository(OwnerEntity)
	  private readonly ownerRepository: Repository<OwnerEntity>
	) { }

	async findByRoom(room: RoomI): Promise<OwnerI[]> {
	  console.log(room);
	  return await this.ownerRepository.find({ where: { room: { id: room.id } } });
	}

	async isOwner(user_id: number, room_id: number): Promise<boolean> {
	  const owner = await this.ownerRepository.findOne({ where: { user: { id: user_id }, room: { id: room_id } } });
	  return !!owner; // Returns true if an owner record was found, false otherwise.
	}

	async addOwner(user_id: number, room_id: number): Promise<OwnerI> {
	  const owner = new OwnerEntity();
	  owner.user = { id: user_id } as User;
	  owner.room = { id: room_id } as RoomEntity;
	  return await this.ownerRepository.save(owner);
	}

	async removeOwner(user_id: number, room_id: number): Promise<void> {
	  const owner = await this.ownerRepository.findOne({ where: { user: { id: user_id }, room: { id: room_id } } });
	  if (owner) {
	    await this.ownerRepository.delete(owner.id);
	  }
	}

}
