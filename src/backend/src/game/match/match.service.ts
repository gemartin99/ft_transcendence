import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { MatchEntity } from './match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
  ) {}

  async createMatch(player1: User, player2: User): Promise<MatchEntity> {
    const newMatch = new MatchEntity();
    newMatch.status = 0;
    newMatch.player1 = player1;
    newMatch.player2 = player2;
    newMatch.player1Score = 0;
    newMatch.player2Score = 0;
    newMatch.winner = null;
    return await this.matchRepository.save(newMatch);
  }
}