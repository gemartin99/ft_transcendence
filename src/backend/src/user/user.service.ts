import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from  'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from  './user.entity';

@Injectable()
export class UserService {
	constructor(
	    @InjectRepository(User)
	    private userRepository: Repository<User>
	) { }
	
	async create(user: User): Promise<User> {
	    return await this.userRepository.save(user);
	}

	async  readAll(): Promise<User[]> {
	    return await this.userRepository.find();
	}

	async update(user: User): Promise<UpdateResult> {

	    return await this.userRepository.update(user.id,user);
	}

	async delete(id): Promise<DeleteResult> {		
	    return await this.userRepository.delete(id);
	}

	async getBy42Id(id42: number): Promise<User> {
		const user = await this.userRepository.findOne({
		where: {
			id: id42,
		},
		});
		// if (user) return user;
		// else throw new UserOauthIdNotFoundException(id);
		if (user) return user;
		else return undefined;
	}
}