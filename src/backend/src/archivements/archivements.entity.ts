import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class ArchivementsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  archivement: number;

  @ManyToOne(() => User, user => user.archivements) // add this line
  user: User; // add this line
}