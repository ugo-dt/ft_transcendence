import { Injectable } from '@nestjs/common';
import { EntityUser } from './entities/user.entity';
import { CreateUserDto } from './createUser.dto';

@Injectable()
export class UsersService {
	users: EntityUser[] = [];

	create(createUserDto: CreateUserDto) {
		const user: EntityUser = {
			name: createUserDto.name,
			id: this.users.length + 1,
			avatar: createUserDto.avatar,
		};

		this.users.push(user);

		return user;
	}
	
	getAllUsers() {
		if (this.users)
			return this.users;
	}

	removeAllUsers() {
		if (this.users)
			this.users.splice(0);
	}

	getUserById(index: number) {
		if (this.users[index])
			return this.users[index];
	}
}