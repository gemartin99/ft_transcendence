import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique: true})
  name: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: true})
  avatar: string;

  @Column({ default: false })
  twofactor: boolean

  @Column({default: 0})
  score: number;

  @Column({default: 0})
  played: number;

  @Column({default: 0})
  wins: number;

  @Column({default: 0})
  losses: number;
}