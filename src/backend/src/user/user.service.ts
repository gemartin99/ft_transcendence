import { Injectable } from '@nestjs/common';
import { Like, Repository, UpdateResult, DeleteResult } from  'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from  './user.entity';
import { AuthService } from '../auth/auth.service';
import { UserI } from  './user.interface';

@Injectable()
export class UserService {
	constructor(
	    // @InjectRepository(User)
	    // private userRepository: Repository<User>
	    @InjectRepository(User)
	    private readonly userRepository: Repository<User>,
	    authService: AuthService
	) { }
	
	async create(user: User): Promise<User> {
	    return await this.userRepository.save(user);
	}

	async save(user: User): Promise<User> {
	    return await this.userRepository.save(user);
	}

	async readAll(): Promise<User[]> {
	    return await this.userRepository.find();
	}

	async update(user: User): Promise<UpdateResult> {

	    return await this.userRepository.update(user.id,user);
	}

	async delete(id): Promise<DeleteResult> {		
	    return await this.userRepository.delete(id);
	}

	async getById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({
		where: {
			id: id,
		},
		});
		return user;
	}

	async getBy42Id(id42: number): Promise<User> {
		const user = await this.userRepository.findOne({
		where: {
			id42: id42,
		},
		});
		return user;
	}



	async register(id42: number): Promise<User> {
		console.log('Enter to register user');
		const user = 
		{
			name: null,
			id42: id42,
			password: 'school42',
			avatar: null
		}
		return await this.userRepository.save(user);
	}

	async findAllByUsername(name: string): Promise<UserI[]> {
	  return this.userRepository.find({
	    where: {
	      name: Like(`%${name}%`)
	    }
	  })
	}

	async findUserFriends(userId: number): Promise<User[]> {
	  console.log('finding users for id ' + userId);
	  // const user = await this.userRepository.findOne(userId, { relations: ["friends"]});
	  const user = await this.userRepository.findOne({
	    where: { id: userId},
	    relations: ['friends'],
	  })
	  return user.friends;
	}
}