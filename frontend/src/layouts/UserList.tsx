import { useEffect } from "react";
import { IChannel } from "../types/IChannel";
import { CHAT_DEFAULT_AVATAR } from "../constants";

interface UserListProps {
	currentChannelId: number;
	channels: IChannel[];
	setCurrentChannelId: (channelId: number) => void;
	update: () => void;
}

// Clicking on a user should show block challenge add friend etc

function UserList({ currentChannelId, channels, setCurrentChannelId, update }: UserListProps) {
	const currentChannel = channels.find(channel => channel.id === currentChannelId);
	const users = currentChannel?.users || [];

	return (
		<div id="div_main_user_list">
			<h2 id="h2_user_list">Users</h2>
			<div id="div_user_list">
				{users.map(user => (
					<button className="button_user_list" key={user.id} onClick={() => console.log(user)}>
						<img id="img_avatar" src={CHAT_DEFAULT_AVATAR} alt="" width={40} height={40}/>
						{user.name}
					</button>
				))}
			</div>
		</div>
	);
}

export default UserList;