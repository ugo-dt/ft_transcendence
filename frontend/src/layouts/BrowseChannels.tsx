import { IChannel } from "../types/IChannel";

interface BrowseChannelsProps {
	currentChannelId: number;
	allChannels: IChannel[];
	setCurrentChannelId: (channelId: number) => void;
	closeForm: (arg0: string) => void;
}

function BrowseChannels({ currentChannelId, allChannels, setCurrentChannelId, closeForm }: BrowseChannelsProps) {
	const channelsToDisplay = allChannels.filter(channel => !channel.isDm);

	return (
		<div id="div_main_browse_channels">
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
						<button>{channel.name}</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default BrowseChannels;