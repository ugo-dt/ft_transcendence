import { useContext, useEffect, useState } from "react";
import { Context, UserContext } from "../context";
import { useLocation, useNavigate } from "react-router";
import { IChannel } from "../types/IChannel";
import Request from "../components/Request";
import Channels from "../layouts/Channels";
import { IUser } from "../types";
import ChatWindow from "../layouts/ChatWindow";
import UserList from "../layouts/UserList";
import './style/Chat.css';

function Chat() {
	const state = useLocation().state;
	const navigate = useNavigate();
	const user = useContext(UserContext).user;
	const setUser = useContext(UserContext).setUser;
	const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined);
	const [channelUsers, setChannelUsers] = useState<IUser[]>([]);
	const [channels, setChannels] = useState<IChannel[]>([]);

	useEffect(() => {
		if (!user) {
			return;
		}
		console.log("state:", state);
		if (state && state.id != undefined) {
			navigate("/messages", { state: {} });
		}
		Request.getUserChannels().then(res => {
			if (res)
				setChannels(res);
			console.log("res: ", res);
		});
		Request.getProfile(user.username).then(res => {
			if (res)
				setUser(res);
		})
	}, []);

	useEffect(() => {
		if (!currentChannel) {
			return ;
		}
		Request.getChannelUsers(currentChannel.id).then(res => {
			if (res) {
				setChannelUsers(res);
			}
		})
	}, [currentChannel]);

	return (
		<div className="chat">
			{
				user &&
				<div className="chat-sections">
					<section className="chat-section-channels">
						<Channels
							user={user}
							channels={channels}
							setChannels={setChannels}
							currentChannel={currentChannel}
							setCurrentChannel={setCurrentChannel}
						/>
					</section>
					<section className="chat-section-chat-window">
						<ChatWindow
							channel={currentChannel}
							user={user}
						/>
					</section>
					<section className="chat-section-user-list">
						<UserList channelUsers={channelUsers} />
					</section>
				</div>
			}
		</div>
	);
}

export default Chat;