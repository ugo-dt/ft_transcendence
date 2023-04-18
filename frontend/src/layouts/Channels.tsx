import { useState } from "react";
import { IUser } from "../types/IUser";

interface ChannelsProps {
	currentChannelId: number;
	user: IUser;
	onHandleChannelClick: (channelId: number) => void;
	onInviteUser: (username: string, toChannel: number) => void;
}


function Channels({ currentChannelId, user, onHandleChannelClick, onInviteUser }: ChannelsProps) {

	const [isCreateChannelFormVisible, setIsCreateChannelFormVisible] = useState(false);
	const [ChanneSettingslInputValue, setChanneSettingslInputValue] = useState("");

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

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setChanneSettingslInputValue(e.target.value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
		  }
	}

	function inviteUser(): void {
		onInviteUser(ChanneSettingslInputValue, currentChannelId);
		setChanneSettingslInputValue("");
		closeForm("form_channel_settings");
		console.log(ChanneSettingslInputValue, currentChannelId);
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
						src="../../../assets/images/gear_icon9.png"
						draggable="false" />
				</button>
				<h2 id="h2_channel_title">Channels</h2>
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
					>ban</button>
					<button
					className="button_channel_settings"
					type="button"
					>kick</button>
					<button
					className="button_channel_settings"
					type="button"
					>mute</button>
				</div>
			</form>
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