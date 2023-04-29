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
	currentChannelId: number;
	channels: IChannel[];
	setChannels: (arg0: IChannel[]) => void;
	setCurrentChannelId: (channelId: number) => void;
}

function Channels({ user, currentChannelId, channels, setChannels, setCurrentChannelId }: ChannelsProps) {
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

	function leaveChannel(id: number): void {
		if (currentChannelId !== -1) {
			Request.leaveChannel(id).then(() => {
				Request.getUserChannels().then((res) => {
					if (res)
						setChannels(res);
				});
			});
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
	}

	async function refresh() {
		console.log('refresh');
		Request.getAllChannels().then((res) => {
			if (res)
				setAllChannels(res);
		});
	}

	function browseChannels() {
		setIsBrowseChannelsOpen(!isBrowseChannelsOpen);
		refresh();
	}

	useEffect(() => {
		console.log("currentChannelId: ", currentChannelId);
	}, [currentChannelId]);

	return (
		<>
			<div className="div-channels">
				<h1>Channels</h1>
				<div className="div-channels-list">
					{channels && channels.map((channel, index) => (
						<button
							className={channel.id === currentChannelId ? 'btn-channels-current' : 'btn-channels'}
							onClick={() => setCurrentChannelId(channel.id)}
							key={index}>
							{channel.name}
						</button>
					))}
					<button
						className="btn-channels-create"
						onClick={() => onClickCreateChannel()}
					>+</button>
				</div>
				<div
					className="user-tag">
					<img
						className="user-avatar"
						src={user.avatar} />
					<b><p
						className="p-username"
					>{user.username}</p></b>
				</div>
				<div className="div-btns">
					<button
						disabled={currentChannelId === -1}
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
						onClick={() => leaveChannel(currentChannelId)}
					>
						<img
							className="btn-channels-settings-img"
							src={CHAT_LEAVE_CHANNEL_ICON} />
					</button>
				</div>
			</div>
			{isCreateChannelFormOpen && <CreateChannelForm onClose={onClickCreateChannel} />}
			{isChannelNewPasswordFormOpen && <ChannelNewPasswordForm onClose={onClickChannelSettings} currentChannelId={currentChannelId} />}
			{isBrowseChannelsOpen && <BrowseChannels onClose={onClickBrowseChannels} allChannels={allChannels} refresh={refresh}/>}
		</>
	); 
}

export default Channels