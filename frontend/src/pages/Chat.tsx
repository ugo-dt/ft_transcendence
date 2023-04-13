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
//
// TODO:
// - handle isDm in createChannel
// - Users should only see channels hes in and get notifications for these -> Add user interface a userChannels[]
// - Add message Date
// - Maybe fix code structure

import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

import { IChannel } from '../types/IChannel';
import { IUser } from '../types/IUser';
import { IMessage } from '../types/IMessage';
import messageSound from "./resources/messageSound.mp3"
import './style/Chat.css'

function Chat() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");

	const [createChannelNameInputValue, setCreateChannelNameInputValue] = useState("");
	const [createChannelPasswordInputValue, setCreateChannelPasswordInputValue] = useState("");
	const [createChannelIsDm, setCreateChannelIsDm] = useState<boolean>(false);

	const [createUserNameInputValue, setCreateUserInputValue] = useState("");
	const [user, setUser] = useState<IUser>(({} as unknown) as IUser);

	const clientId = useRef('');
	const [ChannelID, setChannelId] = useState<number>(0);
	const [channels, setChannels] = useState<IChannel[]>([]);

	const socket = useRef(io("http://192.168.1.136:3000", {
		autoConnect: false,
	})).current;

	function handleSubmitNewMessage(): void {
		if (socket && socket.connected && messageInputValue.length > 0 && messageInputValue.match(/^ *$/) === null) {
			const message: IMessage = {
				content: messageInputValue.trim(),
				senderId: user?.id,
				senderName: user.name,
				timestamp: Date().toString(),
				toChannel: ChannelID
			};
			socket.emit('createMessage', message);
			setMessageInputValue("");
		}
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmitNewMessage();
		}
	};

	function handleKeyDown2(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			createUser();
		}
	};

	function handleKeyDown3(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			createChannel();
		}
	};

	function handleEscapeKey(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			closeCreateChannelForm();
		}
	}

	function onConnect(): void {
		console.log(`Connected with ID: ${socket.id}`);
		clientId.current = socket.id;
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function onDisconnect(): void {
		console.log("Disconnected.");
	}

	function onClear(): void {
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function onCreatedMessage(): void {
		socket.emit('getAllChannels', ChannelID, (response: IChannel[]) => {
			setChannels(response);
		})
		playSound();
	}

	function onCreatedChannel(): void {
		socket.emit('getAllChannels', ChannelID, (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function scrollToBottom(): void {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	function playSound(): void {
		new Audio(messageSound).play();
	}

	function createUser(): void {
		const user: IUser = {
			name: createUserNameInputValue,
			id: -1,
			avatar: null
		}
		socket.emit('createUser', user, (response: IUser) => {
			setUser(response);
			console.log("response: ", response);
		});
		setLoggedIn(true);
	}

	function createChannel(): void {
		if (createChannelNameInputValue.match(/^ *$/))
			alert("Channel Name can't be empty.");
		else if (user) {
			const channel: IChannel = {
				channelId: -1,
				name: createChannelNameInputValue.trim(),
				messageHistory: [],
				password: createChannelPasswordInputValue,
				isDm: createChannelIsDm,
				users: [user],
				admins: [user],
				banned: [],
				muted: [],
			}; // isDM will have to change

			socket.emit('createChannel', channel, (response: IChannel[]) => {
				setChannels(response);
				console.log("response: ", response);
			})
			closeCreateChannelForm();
			setCreateChannelNameInputValue("");
			setCreateChannelPasswordInputValue("");
		}
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

	function clearMessages(): void {
		socket.emit('clear', ChannelID);
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function clearChannels(): void {
		socket.emit('clearChannels');
		socket.emit('getAllChannels', (response: IChannel[]) => {
			setChannels(response);
		})
	}

	useEffect(() => {
		scrollToBottom();
		document.addEventListener("keydown", handleEscapeKey);
		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
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
				<form>
					<label><b>User Name</b></label>
					<input
						required
						type="text"
						placeholder="User Name"
						name="userName"
						value={createUserNameInputValue}
						onKeyDown={handleKeyDown2}
						onChange={(e) => {
							setCreateUserInputValue(e.target.value);
						}}
					/>
					<button
						type="button"
						onClick={createUser}
					>Log in
					</button><br />
					<button
						type="button"
						onClick={() => setLoggedIn(true)}
					>Guest
					</button>
				</form>
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
						onClick={closeCreateChannelForm}
					>✕</button>
					<label id="label_create_channel" htmlFor="email"><b>Channel Name</b></label>
					<input
						className="input_create_channel"
						type="text"
						placeholder="Channel Name"
						name="Name"
						value={createChannelNameInputValue}
						onKeyDown={handleKeyDown3}
						onChange={(e) => {
							setCreateChannelNameInputValue(e.target.value);
						}}
					/>

					<label id="label_create_channel" htmlFor="psw"><b>Password</b></label>
					<input
						className="input_create_channel"
						type="password"
						placeholder="Channel Password"
						name="channelPassword"
						value={createChannelPasswordInputValue}
						onKeyDown={handleKeyDown3}
						onChange={(e) => {
							setCreateChannelPasswordInputValue(e.target.value);
						}}
					/>

					<label id="label_create_channel" htmlFor="psw"><b>Is DM</b></label>
					<input
						className="input_create_channel"
						type="checkbox"
						name="isDm"
						onKeyDown={handleKeyDown3}
					/>

					<button
						type="button"
						id="button_create_channel"
						onClick={createChannel}>
						Create Channel
					</button>
				</form>
				<div id="div_channels">
					<h2 id="h2_channel_title">Channels</h2>
					{channels && channels.map((channel, index) => (
						<button
							onClick={() => setChannelId(index)}
							id={index === ChannelID ? "button_channel_current" : "button_channel"}
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
					<h1 id="h1_main_title">Chat</h1>
					<div id="div_messages_box">
						<ul>
							{channels && channels[ChannelID] && channels[ChannelID].messageHistory.map((message, index) => (
								<li id={"li_messages"}
									key={index}>
									<b>{message.senderName}<br></br></b>
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
							type="button"
							onClick={handleSubmitNewMessage}>
							send
						</button>
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