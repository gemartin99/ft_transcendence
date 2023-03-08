import { Injectable } from '@nestjs/common';
import { OperatorEntity } from './operator.entity';
import { OperatorI } from './operator.interface';
import { RoomI } from '../rooms/room.interface';
import { RoomEntity } from '../rooms/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';

@Injectable()
export class OperatorService {

	constructor(
	  @InjectRepository(OperatorEntity)
	  private readonly operatorRepository: Repository<OperatorEntity>
	) { }


	async findByRoom(room: RoomI): Promise<OperatorI[]> {
	  console.log(room);
	  return await this.operatorRepository.find({ where: { room: { id: room.id } } });
	}

	async isOperator(user_id: number, room_id: number): Promise<boolean> {
	  const operator = await this.operatorRepository.findOne({ where: { user: { id: user_id }, room: { id: room_id } } });
	  return !!operator; // Returns true if an operator record was found, false otherwise.
	}

	async addOperator(user_id: number, room_id: number): Promise<OperatorI> {
	  const operator = new OperatorEntity();
	  operator.user = { id: user_id } as User;
	  operator.room = { id: room_id } as RoomEntity;
	  return await this.operatorRepository.save(operator);
	}

	async removeOperator(user_id: number, room_id: number): Promise<void> {
	  const operator = await this.operatorRepository.findOne({ where: { user: { id: user_id }, room: { id: room_id } } });
	  if (operator) {
	    await this.operatorRepository.delete(operator.id);
	  }
	}
}
