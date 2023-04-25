import { Socket } from "socket.io-client";
import { CHAT_LOCK_ICON } from "../constants";
import { IChannel } from "../types/IChannel";
import { IUser } from "../types/IUser";

interface BrowseChannelsProps {
	currentChannelId: number;
	allChannels: IChannel[];
	closeForm: (arg0: string) => void;
	openForm: (arg0: string) => void;
	socket: Socket;
	setCurrentChannelId: (channelId: number) => void;
	user: IUser;
	channelPasswordInputValue: string;
	setChannelPasswordInputValue: (arg0: string) => void;
}

function BrowseChannels({ setChannelPasswordInputValue, currentChannelId, allChannels, closeForm, socket, setCurrentChannelId, openForm, user, channelPasswordInputValue }: BrowseChannelsProps) {
	const channelsToDisplay = allChannels.filter(channel => !channel.isDm);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setChannelPasswordInputValue(e.target.value);
	}

	function joinChannel(currentChannelId: number) {
		const selectedChannel = allChannels.find(channel => channel.id === currentChannelId);
		if (!selectedChannel?.users.includes(user.name)) {
			if (selectedChannel?.password === undefined)
			{
				socket.emit('join-channel', { currentChannelId, }, (response: IChannel) => {
					if (response.password === undefined) {
						setCurrentChannelId(response.id);
						closeForm("div_main_browse_channels");
					}
				});
			}
			else
			{
				openForm("form_channel_password");
				console.log('lol');
				socket.emit('join-channel', { currentChannelId, channelPasswordInputValue }, (response: IChannel) => {
					if (response.password === undefined) {
						setCurrentChannelId(response.id);
					}
				});
				closeForm("div_main_browse_channels");
				setChannelPasswordInputValue("");
			}
		}
	}

	return (
		<div id="div_main_browse_channels">
			<form id="form_channel_password"
			>
					<button type="button" className="button_close_create_channel" onClick={() => closeForm("form_channel_password")}>
						✕
					</button>
					<label id="label_create_channel" htmlFor="text">
						<b>Channel Password</b>
					</label>
					<input
						className="input_create_channel"
						type="text"
						placeholder="Enter a password..."
						name="name"
						value={channelPasswordInputValue}
						onChange={(e) => handleInputChange(e)}
					/>
				</form>
			<button
				type="button"
				className="button_close_create_channel"
				onClick={() => closeForm("div_main_browse_channels")}>
				✕
			</button>
			<h2 id="h2_browse_channels">Browse channels</h2>
			<div id="div_browse_channels">
				{channelsToDisplay.map(channel => (
					<div key={channel.id} className={currentChannelId === channel.id ? "selected" : ""}>
						<button
							id="button_browse_channels"
							onClick={() => joinChannel(channel.id)}>{channel.name}</button>
						{channel.password !== undefined && (
							<img id="img_lock" src={CHAT_LOCK_ICON} draggable="false" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default BrowseChannels;