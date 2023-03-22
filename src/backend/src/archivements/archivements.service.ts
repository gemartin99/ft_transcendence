import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ArchivementsEntity } from './archivements.entity';
import { MatchData } from '../game/match/match-data/match-data.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ArchivementsService {
	constructor(
	private userService: UserService,	
	@InjectRepository(ArchivementsEntity)
	private readonly archivementsRepository: Repository<ArchivementsEntity>,
	) {}

	async addArchivement(user: User, archivement: number): Promise<void> {
		const newArchivement = new ArchivementsEntity();
		newArchivement.user = user;
		newArchivement.archivement = archivement;
		await this.archivementsRepository.save(newArchivement);
	}

	async getArchivements(user: User): Promise<number[]> {
		const archivements = await this.archivementsRepository.find({
		  where: { user },
		  select: ['archivement'],
		});
		return archivements.map((archivement) => archivement.archivement);
	}

	async getArchivementsForUser(userId: number): Promise<number[]> {
		//console.log('IN getArchivements');
	  const user = await this.userService.getById(userId);
	  if (!user) {
	    return [];
	  }
	  //console.log(user);
	  const archivements = await this.archivementsRepository.find({ where: { user: { id: userId } } });
	  //console.log('IN getArchivements archivements are:');
	  //console.log(archivements);
	  return archivements.map((archivement) => archivement.archivement);
	}

	async updateArchivements(matchData: MatchData, player1: User, player2: User) {
		if(player1.played == 1)
			 await this.archivementsRepository.insert({ archivement: 1, user: player1 });
		if(player2.played == 1)
			 await this.archivementsRepository.insert({ archivement: 1, user: player2 });
		if(player1.played == 1 && player1.wins == 1)
			 await this.archivementsRepository.insert({ archivement: 2, user: player1 });
		if(player2.played == 1 && player2.wins == 1)
			 await this.archivementsRepository.insert({ archivement: 2, user: player2 });
		if(player1.played == 10)
			 await this.archivementsRepository.insert({ archivement: 3, user: player1 });
		if(player2.played == 10)
			 await this.archivementsRepository.insert({ archivement: 3, user: player2 });
		if(player1.played == 50)
			 await this.archivementsRepository.insert({ archivement: 4, user: player1 });
		if(player2.played == 50)
			 await this.archivementsRepository.insert({ archivement: 4, user: player2 });
		if(matchData.score1 == 12 && matchData.score2 == 0)
			 await this.archivementsRepository.insert({ archivement: 5, user: player1 });
		if(matchData.score1 == 0 && matchData.score2 == 12)
			 await this.archivementsRepository.insert({ archivement: 5, user: player2 });
	}
}
