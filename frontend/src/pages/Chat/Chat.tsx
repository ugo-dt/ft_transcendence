// Chat page.
//
// Users should be able to:
//  Create private discussions: send a direct message to any other user
//
//  Block another account. User will not receive messages from the blocked user.
//
//  Create channels (chat rooms):
//    - Either ublic, private, or locked with a password
//    - The channel owner can set a password required to access the channel, change
//       it, and also remove it.
//    - The channel owner is a channel administrator. They can set other users as administrators.
//    - A user who is an administrator of a channel can kick, ban or mute (for a
//       limited time) other users, but not the channel owners.
//
// Invite other players to a Pong game
//
// Access other users profile page

import './Chat.css'
import messageSound from "./resources/messageSound.mp3"

import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

interface IMessage {
	sender: string;
	content: string;
	timestamp: string;
	toChannel: number;
}

interface IChannel {
	channelId: number;
	name: string;
	messageHistory: IMessage[];
	isPrivate: boolean;
	admins: string[]; // should prolly be user.userId at some point
	isDm: boolean;
}

function Chat(): JSX.Element {
	const [loggedIn, setLoggedIn] = useState<boolean>(true);
	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");
	const [createChannelNameInputValue, setCreateNameChannelInputValue] = useState("");
	const [createChannelPasswordInputValue, setcreateChannelPasswordInputValue] = useState("");
	const [createChannelIsDm, setCreateChannelIsDm] = useState<boolean>(false);
	const clientId = useRef('');
	const [ChannelID, setChannelId] = useState<number>(0);
	const [channels, setChannels] = useState<IChannel[]>([{
		channelId: 0,
		name: "default",
		messageHistory: [{
			sender: 'God',
			content: 'Hello. This is God from the backend.',
			timestamp: Date().toString(),
			toChannel: 0
		}],
		isPrivate: false,
		admins: [],
		isDm: false
	}]);
	const socket = useRef(io("http://192.168.1.136:3000", {
		autoConnect: false,
	})).current;

	const handleSubmitNewMessage = (): void => {
		if (socket && socket.connected && messageInputValue.length > 0) {
			const message: IMessage = { content: messageInputValue,
										sender: clientId.current,
										timestamp: Date().toString(),
										toChannel: ChannelID };
			socket.emit('createMessage', message);
			setMessageInputValue("");
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmitNewMessage();
		}
	};

	function onConnect() {
		console.log(`Connected with ID: ${socket.id}`);
		clientId.current = socket.id;
		socket.emit('getAllChannels', {}, (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function onDisconnect() {
		console.log("Disconnected.");
	}

	function onClear() {
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function onCreatedMessage() {
		socket.emit('getAllChannels', ChannelID, (response: IChannel[]) => {
			setChannels(response);
		})
		playSound();
	}

	function onCreatedChannel() {
		socket.emit('getAllChannels', ChannelID, (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function scrollToBottom() {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	function playSound() {
		new Audio(messageSound).play();
	}

	function createChannel(): void {		
		const channel: IChannel = { channelId: 1,
			name: createChannelNameInputValue,
			messageHistory: [],
			isPrivate: false,
			admins: [],
			isDm: createChannelIsDm }; // isDM will have to change
			
			socket.emit('createChannel', channel, (response: IChannel[]) => {			
				setChannels(response);
				console.log("response", response);
			})
		closeCreateChannelForm();
		setCreateNameChannelInputValue("");
		setcreateChannelPasswordInputValue("");
	}

	function openCreateChannelForm() {
		const form = document.getElementById("form_create_channel");
		if (form) {
			form.style.visibility = "visible";
		}
	}

	function closeCreateChannelForm() {		
		const form = document.getElementById("form_create_channel");
		if (form) {
			form.style.visibility = "hidden";
		}
	}

	function clearMessages() {
		socket.emit('clear', ChannelID);
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function clearChannels() {
		socket.emit('clearChannels');
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	useEffect(() => {
		scrollToBottom();
	}, [channels]);

	useEffect(() => {
		console.log("Connecting to server...");
		socket.connect();
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('createdMessage', onCreatedMessage);
		socket.on('createdChannel', onCreatedChannel);
		socket.on('clear', onClear);
		return () => {
			// Cleans up after the component is unmounted.
			// It removes all the event listeners that were added to the socket object
			// and disconnects the socket from the server.
			console.log("Disconnecting from server...");
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, []);

	if (!loggedIn)
		return (
			<>
				<h1>Not Logged in</h1>
				<button onClick={() => setLoggedIn(true)}>Log in</button>
			</>
		)

	return (
		<>
			<div id="div_main">
				<form
					id="form_create_channel">
					<button
					type="button"
					id="button_close_create_channel"
					onClick={closeCreateChannelForm}>✕</button>
					<label id="label_create_channel" htmlFor="email"><b>Channel Name</b></label>
					<input
					className="input_create_channel"
					type="text"
					placeholder="Channel Name"
					name="channelName"
					value={createChannelNameInputValue}
					onChange={(e) => {
						setCreateNameChannelInputValue(e.target.value);
					}}
					required
					/>

					<label id="label_create_channel" htmlFor="psw"><b>Password</b></label>
					<input
					className="input_create_channel"
					type="password"
					placeholder="Channel Password"
					name="channelPassword"
					value={createChannelPasswordInputValue}
					onChange={(e) => {
						setcreateChannelPasswordInputValue(e.target.value);
					}}
					/>

					<label id="label_create_channel" htmlFor="psw"><b>Is DM</b></label>
					<input
					className="input_create_channel"
					type="checkbox"
					name="isDm"
					/>

					<button type="button" id="button_create_channel" onClick={createChannel}>Create Channel</button>
				</form>
				<div id="div_channels">
					<h2 id="h2_channel_title">Channels</h2>
					{channels && channels.map((channel, index) => (
						<button id="button_channel"
							key={index}>
							{channel.name}
						</button>
					))}
					<button
						id="button_open_create"
						onClick={openCreateChannelForm}
					>+</button>
				</div>
				<div id="div_chat_window">
					<h1 id="h1_main_title">Chat app</h1>
					<div id="div_messages_box">
						<ul>
							{channels && channels[ChannelID] && channels[ChannelID].messageHistory.map((message, index) => (
								<li id={message.sender === "God" ? "li_messages-god"
									: message.sender === clientId.current
										? "li_messages-mine" : "li_messages"}
									key={index}>
									{message.content}
								</li>
							))}
							<li ref={messagesEndRef} />
						</ul>
					</div>
					<div id="div_input_box">
						<input
							autoFocus
							placeholder='Type a message...'
							id="div_input_bar"
							type="text"
							value={messageInputValue}
							onKeyDown={handleKeyDown}
							onChange={(e) => {
								setMessageInputValue(e.target.value);
							}}
						/>
						<button
							onClick={scrollToBottom}
							type="submit"
						>scroll</button>
						<button
							onClick={clearMessages}
							type="submit"
						>clear</button>
						<button
							onClick={clearChannels}
							type="submit"
						>clear Channels</button>
						<p id="debug_date">{Date().toString()}</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Chat;
