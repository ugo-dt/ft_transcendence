import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	accessToken: string;

	@Column()
	accessTokenExpirationTime: number;

	@Column()
	refreshToken: string;

	@Column()
	id42: number;
}