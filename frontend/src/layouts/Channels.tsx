import { useState } from "react";
import { IUser } from "../types/IUser";

interface ChannelsProps {
	currentChannelId: number;
	user: IUser;
	onHandleChannelClick: (channelId: number) => void;
}


function Channels({ currentChannelId, user, onHandleChannelClick }: ChannelsProps) {

	const [isCreateChannelFormVisible, setIsCreateChannelFormVisible] = useState(false);

	const openForm = (formToOpen: string) => {
		setIsCreateChannelFormVisible(!isCreateChannelFormVisible);
		const form = document.getElementById(formToOpen);
		if (form) {
			form.style.visibility = "visible";
		}
	};

	const closeForm = (formToClose: string) => {
		setIsCreateChannelFormVisible(!isCreateChannelFormVisible);
		const form = document.getElementById(formToClose);
		if (form) {
			form.style.visibility = "hidden";
		}
	};

	function handleChannelClick(channelId: number) {
		onHandleChannelClick(channelId);
	}

	return (
		<div id="div_channels">
			<h2 id="h2_channel_title">Channels</h2>
			{user.userChannels && user.userChannels.map((channel, index) => (
				<div key={channel.channelId} id='div_buttons'>
					<button
						onClick={() => handleChannelClick(channel.channelId)}
						id={channel.channelId === currentChannelId ? "button_channel_current" : "button_channel"}
						key={index}>
						{channel.name}
					</button>
				</div>
			))}
			<button
				id="button_open_create"
				onClick={() => openForm("form_create_channel")}
			>+</button>
		</div>
	);
}

export default Channels