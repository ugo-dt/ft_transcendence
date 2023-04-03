import { Exclude } from "class-transformer";
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
	@Exclude()
	accessToken: string;

	@Column()
	@Exclude()
	expirationTime: number;

	@Column()
	@Exclude()
	refreshToken: string;

	@Column()
	id42: number;

	@Column()
	name: string;

	@Column()
	avatar: string;
}