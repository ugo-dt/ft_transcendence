import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";
import { IChannel } from "../types/IChannel";
import { CHAT_BROWSE_CHANNEL_ICON, CHAT_GEAR_ICON } from "../constants";
import { Socket } from "socket.io-client";

interface ChannelsProps {
	currentChannelId: number;
	channels: IChannel[];
	setCurrentChannelId: (channelId: number) => void;
	socket: Socket;
	update: () => void;
	openForm: (arg0: string) => void;
}

function Channels({ currentChannelId, channels, setCurrentChannelId, socket, update, openForm }: ChannelsProps) {

	const [isCreateChannelFormVisible, setIsCreateChannelFormVisible] = useState(false);
	const [ChanneSettingslInputValue, setChanneSettingslInputValue] = useState("");

	const closeForm = (formToClose: string) => {
		const form = document.getElementById(formToClose);
		if (form) {
			form.style.visibility = "hidden";
		}
	};

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setChanneSettingslInputValue(e.target.value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	}

	function inviteUser(): void {
		socket.emit('invite-user', { ChanneSettingslInputValue, currentChannelId }, (response: { data: IUser | null }) => {
			closeForm("form_channel_settings");
			setChanneSettingslInputValue("");
			if (response.data === null)
				alert('User not found.')
			else {
				console.log(response);
			}
		})
	}

	function kickUser(): void {
		socket.emit('kick-user', { ChanneSettingslInputValue, currentChannelId }, (response: { data: IUser | null }) => {
			closeForm("form_channel_settings");
			setChanneSettingslInputValue("");
			if (response.data === null)
				alert('User not found.')
			else {
				console.log(response);
			}
		})
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
		socket.emit('leave-channel', { currentChannelId });
		closeForm("form_channel_settings");
		setChanneSettingslInputValue("");
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
		update();
	}

	return (
		<div id="div_channels">
			<div id="div_top_module">
				<button
					style={{ pointerEvents: currentChannelId === -1 ? 'none' : 'all' }} // and hidden if not admin
					id="button_channel_settings"
					onClick={() => openForm("form_channel_settings")}
				>
					<img
						id="img_channel_settings"
						src={CHAT_GEAR_ICON}
						draggable="false" />
				</button>
				<h2 id="h2_channel_title">Channels</h2>
				<button
					id="button_channel_browse"
					onClick={() => openForm("div_main_browse_channels")}
				>
					<img
						id="img_channel_settings"
						src={CHAT_BROWSE_CHANNEL_ICON}
						draggable="false" />
				</button>
			</div>
			<form id="form_channel_settings">
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
			</form>
			{channels && channels.map((channel, index) => (
				<div key={channel.id} id='div_buttons'>
					<button
						onClick={() => setCurrentChannelId(channel.id)}
						id={channel.id === currentChannelId ? "button_channel_current" : "button_channel"}
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