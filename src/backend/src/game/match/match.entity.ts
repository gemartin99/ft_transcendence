import { User } from "../../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { RoomEntity } from "../rooms/room.entity";

@Entity()
export class MatchEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  status: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @Column({ default: 0 })
  player1Score: number;

  @Column({ default: 0 })
  player2Score: number;

  @Column({ nullable: true })
  winner: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}