import { useState } from "react";
import { CHAT_REFRESH_ICON } from "../constants";
import { IChannel, IUser } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "../components/Request";

interface BrowseChannelsProps {
	onClose?: () => void,
	allChannels: IChannel[];
	refresh: () => void;
	user: IUser;
	setChannels: (arg0: IChannel[]) => void;
	setCurrentChannelId: (channelId: number) => void;
}

function BrowseChannels({ onClose, allChannels, refresh, user, setChannels, setCurrentChannelId }: BrowseChannelsProps) {
	const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);
	const [currentChannel, setCurrentChannel] = useState<IChannel>();

	function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); }

	function joinChannel(channel: IChannel) {
		if (!channel.users.includes(user.id)) {
			if (!channel) {
				return;
			}
			if (channel.password != null && channel.password.length) {
				setCurrentChannel(channel);
				setIsJoinPasswordOpen(true);
			}
			else
			{
				Request.joinChannel(channel.id).then((res) => {
					setCurrentChannelId(channel.id);
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
						{channel.name} &#x1F464; {channel.users.length} {channel.password ? '\u{1F512}' : ''}
					</button>))}
			</div>
			{isJoinPasswordOpen && <JoinPasswordForm
			onClose={onClickJoinPassword}
			joinChannel={joinChannel}
			channel={currentChannel as IChannel}
			setCurrentChannelId={setCurrentChannelId}
			setIsJoinPasswordOpen={setIsJoinPasswordOpen}
			refresh={refresh}
			/>}
		</div>
	);
}

export default BrowseChannels;