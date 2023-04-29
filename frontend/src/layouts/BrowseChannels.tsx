import { useEffect, useRef, useState } from "react";
import { CHAT_REFRESH_ICON } from "../constants";
import { IChannel } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "../components/Request";

interface BrowseChannelsProps {
	onClose?: () => void,
	allChannels: IChannel[];
	refresh: () => void;
}

function BrowseChannels({ onClose, allChannels, refresh }: BrowseChannelsProps) {
	const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);

	function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); }

	function joinChannel(channel: IChannel) {
		if (!channel) {
			return ;
		}
		console.log("allChannels: ", allChannels);

		if (channel.password != null && channel.password.length) {
			console.log(channel.password);
			setIsJoinPasswordOpen(true);
		}
		else {
			Request.joinChannel(channel.id).then((res) => {
				// handle response
			});
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
			{isJoinPasswordOpen && <JoinPasswordForm onClose={onClickJoinPassword} />}
		</div>
	);
}

export default BrowseChannels;