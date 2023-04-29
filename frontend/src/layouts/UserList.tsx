import { useEffect } from "react";
import { IChannel } from "../types/IChannel";
import { CHAT_DEFAULT_AVATAR } from "../constants";
import './style/UserList.css';
import { IUser } from "../types";

interface UserListProps {
	channelUsers: IUser[];
}

// Clicking on a user should show add to dms block challenge add friend etc

function UserList({ channelUsers }: UserListProps) {
	return (
		<div className="div-user-list">
			<h1>Users</h1>
			<div className="div-users">
				{channelUsers.map((user, index) => (
					<button className="btn-user-list" key={index} onClick={() => console.log(user)}>
						<img className="user-avatar" src={user.avatar} width={40} height={40} />
						<p><b>{user.username}</b></p>
					</button>

				))}
			</div>
		</div>
	);
}

export default UserList;