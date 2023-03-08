import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, unique: true})
  name: string;

  @Column({nullable: false})
  password: string;

  @Column({unique: true})
  id42: number;

  @Column({ default: false })
  twofactor: boolean

  @Column({ default: false })
  twofactor_valid: boolean

  @Column({ default: false })
  reg_completed: boolean

  @Column({default: 0})
  score: number;

  @Column({default: 0})
  played: number;

  @Column({default: 0})
  wins: number;

  @Column({default: 0})
  losses: number;

  @Column({nullable: true})
  avatar: string;
}