import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";
import { IChannel } from "../types/IChannel";
import { CHAT_BROWSE_CHANNEL_ICON, CHAT_GEAR_ICON, CHAT_LEAVE_CHANNEL_ICON } from "../constants";
import CreateChannelForm from "./CreateChannelForm";
import ChannelNewPasswordForm from "./ChannelNewPasswordForm";
import './style/Channels.css'
import Request from "../components/Request";
import BrowseChannels from "./BrowseChannels";

interface ChannelsProps {
	user: IUser;
	channels: IChannel[];
	setChannels: (arg0: IChannel[]) => void;
	currentChannel: IChannel | undefined;
	setCurrentChannel: (channelId: IChannel | undefined) => void;
}

function Channels({ user, channels, setChannels, currentChannel, setCurrentChannel }: ChannelsProps) {
	const [isCreateChannelFormOpen, setIsCreateChannelFormOpen] = useState(false);
	const [isChannelNewPasswordFormOpen, setIsChannelNewPasswordFormOpen] = useState(false);
	const [isBrowseChannelsOpen, setIsBrowseChannelsOpen] = useState(false);
	const [ChanneSettingslInputValue, setChanneSettingslInputValue] = useState("");
	const [allChannels, setAllChannels] = useState<IChannel[]>([]);

	function onClickCreateChannel() { setIsCreateChannelFormOpen(!isCreateChannelFormOpen); }
	function onClickChannelSettings() { setIsChannelNewPasswordFormOpen(!isChannelNewPasswordFormOpen); }
	function onClickBrowseChannels() { setIsBrowseChannelsOpen(!isBrowseChannelsOpen); }

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
		if (!currentChannel) {
			return;
		}
		Request.leaveChannel(currentChannel.id).then(() => {
			refresh();
		});
		const currentIndex = channels.findIndex((channel) => channel.id === currentChannel.id);
		const previousChannel = channels[currentIndex - 1];
		const subsequentChannel = channels[currentIndex + 1];
		let newChannelId = -1;
		if (previousChannel) {
			setCurrentChannel(previousChannel);
		} else if (subsequentChannel) {
			setCurrentChannel(subsequentChannel);
		}
	}

	async function refresh() {
		console.log('refresh');
		Request.getAllChannels().then((res) => {
			if (res)
				setAllChannels(res);
		});
		Request.getUserChannels().then(res => {
			if (res)
				setChannels(res);
		});
	}

	function browseChannels() {
		console.log("user.userChannels: ", user.userChannels);
		setIsBrowseChannelsOpen(!isBrowseChannelsOpen);
		refresh();
	}

	return (
		<>
			<div className="div-channels">
				<h1>Channels</h1>
				<div className="div-channels-list">
					<button
						className="btn-channels-create"
						onClick={() => onClickCreateChannel()}
					>+</button>
					{channels && channels.map((channel, index) => (
						<button
							className={currentChannel && channel.id === currentChannel.id ? 'btn-channels-current' : 'btn-channels'}
							onClick={() => setCurrentChannel(channel)}
							key={index}>
							{channel.name}
						</button>
					))}
				</div>
				<div
					className="user-tag">
					<img
						id="avatar-component"
						width={40}
						height={40}
						src={user.avatar} />
					<b><p
						className="p-username"
					>{user.username}</p></b>
				</div>
				<div className="div-btns">
					<button
						disabled={currentChannel && currentChannel.id === -1}
						className="btn-channels-settings"
						onClick={onClickChannelSettings}
					>
						<img
							className="btn-channels-settings-img"
							src={CHAT_GEAR_ICON} />
					</button>
					<button
						className="btn-channels-settings"
						onClick={browseChannels}
					>
						<img
							className="btn-channels-settings-img"
							src={CHAT_BROWSE_CHANNEL_ICON} />
					</button>
					<button
						className="btn-channels-settings"
						onClick={leaveChannel}
					>
						<img
							className="btn-channels-settings-img"
							src={CHAT_LEAVE_CHANNEL_ICON} />
					</button>
				</div>
			</div>
			{isCreateChannelFormOpen && <CreateChannelForm onClose={onClickCreateChannel} />}
			{isChannelNewPasswordFormOpen && <ChannelNewPasswordForm onClose={onClickChannelSettings} currentChannel={currentChannel} />}
			{isBrowseChannelsOpen && <BrowseChannels
				onClose={onClickBrowseChannels}
				allChannels={allChannels}
				refresh={refresh}
				user={user}
				setChannels={setChannels}
				currentChannel={currentChannel}
				setCurrentChannel={setCurrentChannel} />}
		</>
	);
}

export default Channels