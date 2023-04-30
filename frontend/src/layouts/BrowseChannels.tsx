import { useState } from "react";
import { CHAT_REFRESH_ICON } from "../constants";
import { IChannel, IUser } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "../components/Request";

export const EMPTY: string = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

interface BrowseChannelsProps {
	onClose?: () => void,
	allChannels: IChannel[];
	refresh: () => void;
	user: IUser;
	setChannels: (arg0: IChannel[]) => void;
	currentChannel: IChannel | undefined,
	setCurrentChannel: (arg0: IChannel) => void;
}

function BrowseChannels({ onClose, allChannels, refresh, user, currentChannel, setCurrentChannel }: BrowseChannelsProps) {
	const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);

	function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); }

	console.log("allChannels: ", allChannels);

	function joinChannel(channel: IChannel) {
		if (!channel.users.includes(user.id)) {
			if (!channel) {
				return;
			}
			if (channel.password && channel.password !== EMPTY && channel.password.length) {
				setCurrentChannel(channel);
				setIsJoinPasswordOpen(true);
			}
			else
			{
				Request.joinChannel(channel.id).then((res) => {
					setCurrentChannel(channel);
					setIsJoinPasswordOpen(false);
					refresh();
				});
			}
		}
	}

	return (
		<div className="browse-channels">
			<h1>Browse Channels</h1>
			<button className="btn-browse-refresh" onClick={refresh}>
				<img
					className="img-btn-refresh"
					src={CHAT_REFRESH_ICON}
					alt="fesse" />
			</button>
			<div className="modal-close" role="button" onClick={onClose}>&times;</div>
			<div className="browse-channels-list">
				{allChannels.map((channel, index) => (
					<button
						key={index}
						className='btn-browse-channels'
						onClick={() => joinChannel(channel)}
					>
						{channel.name} &#x1F464; {channel.users.length} {channel.password !== EMPTY ? '\u{1F512}' : ''}
					</button>))}
			</div>
			{isJoinPasswordOpen && <JoinPasswordForm
			onClose={onClickJoinPassword}
			joinChannel={joinChannel}
			channel={currentChannel as IChannel}
			setCurrentChannel={setCurrentChannel}
			setIsJoinPasswordOpen={setIsJoinPasswordOpen}
			refresh={refresh}
			/>}
		</div>
	);
}

export default BrowseChannels;