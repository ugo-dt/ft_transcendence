// Chat page.
//
// Users should be able to:
//  Create private discussions: send a direct message to any other user
//
//  Block another account. User will not receive messages from the blocked user.
//
//  Create channels (chat rooms):
//    - Either public, private, or locked with a password
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
// - implement isDm
// - When no channel is selected user should not be typing
// - Users should only see channels hes in and get notifications for these -> Add user interface a userChannels[]
// - Add message Date and user image in chat
// - Maybe fix code structure

import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

import CreateChannelForm from '../layouts/CreateChannelForm';
import { IChannel } from '../types/IChannel';
import { IUser } from '../types/IUser';
import { IMessage } from '../types/IMessage';
import messageSound from "../../assets/sound/messageSound.mp3"
import './style/Chat.css'
import ChatWindow from '../layouts/ChatWindow';
import Channels from '../layouts/Channels';

function Chat() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const [isCreateChannelFormVisible, setIsCreateChannelFormVisible] = useState(false);
	const [createChannelNameInputValue, setCreateChannelNameInputValue] = useState("");
	const [createChannelPasswordInputValue, setCreateChannelPasswordInputValue] = useState("");
	const [createChannelIsDm, setCreateChannelIsDm] = useState<boolean>(false);

	const [createUserNameInputValue, setCreateUserInputValue] = useState("");
	const user = useRef<IUser>({} as IUser);

	const clientId = useRef('');
	const [currentChannelId, setCurrentChannelId] = useState<number>(-1);
	const [channels, setChannels] = useState<IChannel[]>([]);

	const socket = useRef(io("http://localhost:3000/chat", {
		autoConnect: false,
	})).current;

	function handleSubmitNewMessage(messageInputValue: string): void {
		if (socket &&
			socket.connected &&
			messageInputValue.length > 0 &&
			messageInputValue.match(/^ *$/) === null) {
			const message: IMessage = {
				content: messageInputValue.trim(),
				senderId: user.current?.id,
				senderName: user.current.name,
				timestamp: Date().toString(),
				toChannel: currentChannelId
			};
			socket.emit('create-message', message);
			setMessageInputValue("");
			socket.emit('get-all-channels', user.current, (response: IChannel[]) => {
				setChannels(response);
			})
			if (loggedIn)
				playSound();
		}
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmitNewMessage(messageInputValue);
		}
	};

	function handleKeyDown2(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			createUser();
		}
	};

	function handleEscapeKey(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			closeForm("form_create_channel");
		}
	}

	function handleChannelClick(channelId: number) {
		setCurrentChannelId(channelId);
	}

	function onConnect(): void {
		console.log(`Connected with ID: ${socket.id}`);
		clientId.current = socket.id;
		if (loggedIn) {
			socket.emit('get-all-channels', currentChannelId, (response: IChannel[]) => {
				setChannels(response);
			})
		}
	}

	function onDisconnect(): void {
		console.log("Disconnected.");
	}

	function onCleared(): void {
		socket.emit('get-all-channels', user.current, (response: IChannel[]) => {
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

	function inviteUser(userName: string): void {
		socket.emit('invite-user', userName);
	}

	function createUser(): void {
		const newUser: IUser = {
			name: createUserNameInputValue,
			id: -1,
			avatar: null,
			userChannels: []
		};
		socket.emit('create-user', newUser, (response: IUser) => {
			user.current = response;
		});
		setLoggedIn(true);
	}

	function createChannel(createChannelNameInputValue: string, createChannelPasswordInputValue: string): void {
		if (createChannelNameInputValue.match(/^ *$/))
			alert("Channel Name can't be empty.");
		else if (user) {
			const newChannel: IChannel = {
				channelId: -1,
				name: createChannelNameInputValue.trim(),
				messageHistory: [],
				password: createChannelPasswordInputValue,
				isDm: createChannelIsDm,
				users: [user.current],
				admins: [user.current],
				banned: [],
				muted: [],
			}; // isDM will have to change
			socket.emit('create-channel', newChannel, (response: IChannel) => {
				channels.push(response);
				user.current.userChannels.push(response);
				setCurrentChannelId(response.channelId);
				socket.emit('get-all-channels', user, (response: IChannel[]) => {
					setChannels(response);
				})
			})
			closeForm("form_create_channel");
		}
	}

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

	function clearMessages(): void {
		socket.emit('clear', currentChannelId);
		socket.emit('get-all-channels', user.current, (response: IChannel[]) => {
			setChannels(response);
		})
	}

	function clearChannels(): void {
		socket.emit('clear-channels');
		socket.emit('get-all-channels', user.current, (response: IChannel[]) => {
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
		socket.on('cleared', onCleared);
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
				<CreateChannelForm
					onSetCreateChannelNameInputValue={setCreateChannelNameInputValue}
					onSetCreateChannelPasswordInputValue={setCreateChannelPasswordInputValue}
					onSubmit={createChannel}
					onClose={() => closeForm("form_create_channel")}
				/>
				<Channels
					currentChannelId={currentChannelId}
					user={user.current}
					onHandleChannelClick={handleChannelClick}
				/>
				<ChatWindow
					onClearChannels={clearChannels}
					onClearMessages={clearMessages}
					onHandleSubmitNewMessage={handleSubmitNewMessage}
					onSetMessageInputValue={setMessageInputValue}
					channels={channels}
					currentChannelId={currentChannelId}
				/>
			</div>
		</>
	);
}

export default Chat;