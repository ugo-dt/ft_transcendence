import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import { useNavigate } from "react-router";
import { IChannel } from "../types/IChannel";
import Request from "../components/Request";
import Channels from "../layouts/Channels";


/**
 * get all channels
 * 
 * 
 */

function Chat() {
	const navigate = useNavigate();
	const user = useContext(UserContext).user;
	const setUser = useContext(UserContext).setUser;
	const [channels, setChannels] = useState<IChannel[]>([]);
	const [currentChannelId, setCurrentChannelId] = useState<number>(-1);

	useEffect(() => {
		Request.me().then(res => {
			if (res) {
				setUser(res);
				setChannels(res.userChannels);
			}
		})
		if (user)
		console.log("user.userChannels: ", user.userChannels);
	}, []);

	return (
		<div className="Chat">
			<Channels
				currentChannelId={currentChannelId}
				channels={channels}
				setCurrentChannelId={setCurrentChannelId}
			/>
		</div>
	);
}

export default Chat;