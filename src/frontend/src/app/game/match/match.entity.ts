import { User } from "../../user/user";

export class Match {
id?: number;
status?: number;
player1?: User;
player2?: User;
player1Score?: number;
player2Score?: number;
winner?: number;
created_at?: Date;
updated_at?: Date;
}