import { useContext, useEffect, useState } from "react";
import { Context, UserContext } from "../context";
import { useLocation, useNavigate } from "react-router";
import { IChannel } from "../types/IChannel";
import Request from "../components/Request";
import Channels from "../layouts/Channels";
import { IUser } from "../types";
import ChatWindow from "../layouts/ChatWindow";
import './style/Chat.css';
import UserList from "../layouts/UserList";

function Chat() {
	const state = useLocation().state;
	const navigate = useNavigate();
	const user = useContext(UserContext).user;
	const setUser = useContext(UserContext).setUser;
	const [channels, setChannels] = useState<IChannel[]>([]);
	const [channelUsers, setChannelUsers] = useState<IUser[]>([]);
	const { currentChannelId, setCurrentChannelId } = useContext(Context);

	useEffect(() => {
		if (!user) {
			return;
		}
		console.log("state:", state);
		if (state && state.id != undefined) {
			setCurrentChannelId(state.id);
			navigate("/messages", { state: {} });
		}
		Request.getUserChannels().then(res => {
			if (res)
				setChannels(res);
			
		});
		Request.getProfile(user.username).then(res => {
			if (res)
				setUser(res);
		})
	}, []);

	useEffect(() => {
		if (currentChannelId === -1)
		{
			setChannelUsers([]);
		}
		else
		{
			Request.getChannelUsers(currentChannelId).then((res) => {
				if (res)
				setChannelUsers(res);
			});
		}
	}, [currentChannelId]);

	return (
		<div className="chat">
			<Channels
				user={user as IUser}
				currentChannelId={currentChannelId}
				channels={channels}
				setChannels={setChannels}
				setCurrentChannelId={setCurrentChannelId}
			/>
			<ChatWindow />
			<UserList channelUsers={channelUsers} />
		</div>
	);
}

export default Chat;