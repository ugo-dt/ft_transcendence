import { CHAT_DEFAULT_AVATAR } from "../constants";
import { IUser } from "../types";
import Channels from "./Channels";

function UserTagAndChannels({ profile }: { profile: IUser | null}) {
	return (
		<div id="div-user-tag-and-channels">
			<Channels />
			<div id='div-user'>
				<img id="img-avatar" src={CHAT_DEFAULT_AVATAR} alt="" width={40} height={40} />
				<b><p>{profile?.username}</p></b>
			</div>
		</div>
	)
}

export default UserTagAndChannels;