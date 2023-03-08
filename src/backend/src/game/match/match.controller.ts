import { Controller, Get, Param , UseGuards} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './match.entity';
import { User } from '../../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('match')
export class MatchController {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
  ) {}

  @Get('user-matches/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserMatches(@Param('userId') userId: number): Promise<MatchEntity[]> {
    const user = new User(); // create an instance of the user entity with the provided userId
    user.id = userId;
    return await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .where('player1.id = :userId OR player2.id = :userId', { userId: user.id })
      .getMany();
  }
}