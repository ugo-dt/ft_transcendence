import { useEffect } from "react";
import { IChannel } from "../types/IChannel";
import { CHAT_DEFAULT_AVATAR } from "../constants";

interface UserListProps {
	currentChannelId: number;
	channels: IChannel[];
}

// Clicking on a user should show add to dms block challenge add friend etc

function UserList({ currentChannelId, channels }: UserListProps) {
	//const currentChannel = channels.find(channel => channel.id === currentChannelId);
	//const users = currentChannel?.users || [];

	return (
		<div id="div-main-user-list">
			<h2 id="h2-user-list">Users</h2>
			<div id="div-user-list">
				{/*{users.map((user, index) => (
					<button className="button_user_list" key={index} onClick={() => console.log(user)}>
						<img id="img_avatar" src={CHAT_DEFAULT_AVATAR} width={40} height={40}/>
						<p><b>{user.name}</b></p>
					</button>
				))}*/}
			</div>
		</div>
	);
}

export default UserList;