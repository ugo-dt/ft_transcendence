import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";
import { IChannel } from "../types/IChannel";
import { CHAT_BROWSE_CHANNEL_ICON, CHAT_GEAR_ICON } from "../constants";
import { Socket } from "socket.io-client";
import CreateChannelForm from "./CreateChannelForm";
import './style/Channels.css'

interface ChannelsProps {
	currentChannelId: number;
	channels: IChannel[];
	setCurrentChannelId: (channelId: number) => void;
}

function Channels({ currentChannelId, channels, setCurrentChannelId }: ChannelsProps) {
	const [isCreateChannelFormOpen, setIsCreateChannelFormOpen] = useState(false);
	const [ChanneSettingslInputValue, setChanneSettingslInputValue] = useState("");

	function onClickCreateChannel() { 
		setIsCreateChannelFormOpen(!isCreateChannelFormOpen); 
		console.log("channels: ", channels);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setChanneSettingslInputValue(e.target.value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	}

	function inviteUser(): void {

	}

	function kickUser(): void {

	}

	function muteUser(): void {
		console.log('muteUser');
	}

	function banUser(): void {
		console.log('banUser');

	}

	function unBanUser(): void {

	}

	function adminUser(): void {
		console.log('adminUser');

	}

	function changePassword(): void {
		console.log('changePassword');

	}

	function leaveChannel(): void {
		const currentIndex = channels.findIndex((channel) => channel.id === currentChannelId);
		const previousChannel = channels[currentIndex - 1];
		const subsequentChannel = channels[currentIndex + 1];
		let newChannelId = -1;
		if (previousChannel) {
			newChannelId = previousChannel.id;
		} else if (subsequentChannel) {
			newChannelId = subsequentChannel.id;
		}
		setCurrentChannelId(newChannelId);
	}

	return (
		<div className="div-channels">
			<div className="div-top-module">
				{/*<button
					style={{ pointerEvents: currentChannelId === -1 ? 'none' : 'all' }} // and hidden if not admin
					id="button_channel_settings"
					onClick={() => openForm("form_channel_settings")}
				>
					<img
						id="img_channel_settings"
						src={CHAT_GEAR_ICON}
						draggable="false" />
				</button>*/}
				<h1>Channels</h1>
				{/*<button
					id="button_channel_browse"
					onClick={() => openForm("div_main_browse_channels")}
				>
					<img
						id="img_channel_settings"
						src={CHAT_BROWSE_CHANNEL_ICON}
						draggable="false" />
				</button>*/}
			</div>
			{/*<form id="form_channel_settings">
				<button
					type="button"
					className="button_close_create_channel"
					onClick={() => closeForm("form_channel_settings")}>
					✕
				</button>
				<h3 id="h3_channel_settings_title">Channel Settings</h3>
				<input
					id="input_channel_settings"
					type="text"
					placeholder="Enter Username"
					value={ChanneSettingslInputValue}
					onKeyDown={handleKeyDown}
					onChange={(e) => handleInputChange(e)}
				/>
				<div>
					<button
						className="button_channel_settings"
						type="button"
						onClick={inviteUser}
					>invite</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={banUser}
					>ban</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={kickUser}
					>kick</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={muteUser}
					>mute</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={adminUser}
					>admin</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={changePassword}
					>Set a new password
					</button>
					<button
						className="button_channel_settings"
						type="button"
						onClick={leaveChannel}
					>Leave the channel
					</button>
				</div>
			</form>*/}
			{/*{channels && channels.map((channel, index) => (
				<div key={channel.id} id='div_buttons'>
					<button
						onClick={() => setCurrentChannelId(channel.id)}
						id={channel.id === currentChannelId ? "button_channel_current" : "button_channel"}
						key={index}>
						{channel.name}
					</button>
				</div>
			))}*/}
			<button
				className="btn-channels"
			>
				TEST
			</button>
			<button
				className="btn-channels-create"
				onClick={() => onClickCreateChannel()}
			>+</button>
			{isCreateChannelFormOpen && <CreateChannelForm onClose={onClickCreateChannel} />}
		</div>

	);
}

export default Channels