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

	async setTwoFactorSecret(secret: string, userId: number) {
		return this.userRepository.update(userId, {
		twofactor_secret: secret
		});
	}

	async setTwoFactorAuthentificated(userId: number) {
		return this.userRepository.update(userId, {
		twofactor: true,
		twofactor_valid: true
		});
	}

	async unsetTwoFactorAuthentificated(userId: number) {
		return await this.userRepository.update(userId, {
		twofactor: false
		});
	}
	
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

	async setUserOffline(user: User)
	{
		user.is_online = false;
		return await this.update(user);
	}

	async setUserOnline(user: User)
	{
		user.is_online = true;
		return await this.update(user);
	}

	async setUserAvatar(user: User, filename: string)
	{
		user.avatar = filename;
		return await this.update(user);
	}

	async setUserInPlay(user: User, matchId: number)
	{
		user.is_playing = matchId;
		return await this.update(user);
	}

	async setUserOffPlay(user: User)
	{
		user.is_playing = 0;
		return await this.update(user);
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

	async getByName(username: string): Promise<User> {
		const user = await this.userRepository.findOne({
		where: {
			name: username,
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
	async findAllById(id: number): Promise<UserI[]> {
	  return this.userRepository.find({
	  	where: {
	  		id: id,
	  	},
	  	});
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

	async findBlockedUsers(userId: number): Promise<User[]> {
	  console.log('finding blcokedds users for id ' + userId);
	  // const user = await this.userRepository.findOne(userId, { relations: ["friends"]});
	  const user = await this.userRepository.findOne({
	    where: { id: userId},
	    relations: ['blocked_users'],
	  })
	  return user.blocked_users;
	}

	async getUserRanking(userId: number): Promise<number> {
	  const user = await this.userRepository.findOne({
	    where: {
	      id: userId,
	    }
	  })
	  const userScore = user.score;
	  const ranking = await this.userRepository
	    .createQueryBuilder('user')
	    .orderBy('user.score', 'DESC')
	    .getMany();
	  const userRank = ranking.findIndex(u => u.id === user.id) + 1;
	  return userRank;
	}
}