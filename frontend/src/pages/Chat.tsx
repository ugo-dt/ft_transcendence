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
// - Leave Channel
// - Users should only see channels hes in and get notifications for these -> Add user interface a userChannels[]
// - Browse channels window
// - All users and their rights on the right
// - Hash channel passwords
// - Show name and avatar under channels

import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

import CreateChannelForm from '../layouts/CreateChannelForm';
import { IChannel } from '../types/IChannel';
import { IUser } from '../types/IUser';
import { IMessage } from '../types/IMessage';
import './style/Chat.css'
import ChatWindow from '../layouts/ChatWindow';
import Channels from '../layouts/Channels';

function Chat() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [messageInputValue, setMessageInputValue] = useState("");

	const [isCreateChannelFormVisible, setIsCreateChannelFormVisible] = useState(false);
	const [createChannelNameInputValue, setCreateChannelNameInputValue] = useState("");
	const [createChannelPasswordInputValue, setCreateChannelPasswordInputValue] = useState("");

	const [createUserNameInputValue, setCreateUserInputValue] = useState("");
	const user = useRef<IUser>({} as IUser);
	const [channels, setChannels] = useState<IChannel[]>([]);

	const [currentChannelId, setCurrentChannelId] = useState<number>(-1);

	const socket = useRef(io("http://192.168.1.136:3000/chat", {
		autoConnect: false,
	})).current;

	function handleSubmitNewMessage(messageInputValue: string): void {
		if (socket &&
			socket.connected &&
			messageInputValue.length > 0 &&
			messageInputValue.match(/^ *$/) === null) {
			const message = {
				content: messageInputValue.trim(),
				toChannel: currentChannelId
			};
			socket.emit('create-message', message);
			update();
			setMessageInputValue("");
		}
	}

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
			closeForm("form_channel_settings")
		}
	}

	function handleChannelClick(channelId: number) {
		setCurrentChannelId(channelId);
	}

	function onConnect(): void {
		console.log(`Connected with ID: ${socket.id}`);
		if (loggedIn) {
			update();
		}
	}

	function onDisconnect(): void {
		console.log("Disconnected.");
	}

	function onUpdate(): void {
		console.log('update');
		update();
	}

	function update(): void {
		socket.emit('get-user-channels', user.current, (response: IChannel[]) => {
			setChannels(response);
		});
	}

	

	function createUser(): void {
		socket.emit('create-user', createUserNameInputValue, (response: IUser) => {
			user.current = response;
			update();
		});
		setLoggedIn(true);
	}

	function createChannel(createChannelNameInputValue: string, createChannelPasswordInputValue: string): void {
		if (createChannelNameInputValue.match(/^ *$/))
			alert("Channel Name can't be empty.");
		else if (user) {
			const newChannel = {
				channelId: -1,
				name: createChannelNameInputValue.trim(),
				history: [],
				password: createChannelPasswordInputValue,
				isDm: false,
				users: [user.current],
				admins: [user.current],
				banned: [],
				muted: [],
			};
			socket.emit('create-channel', newChannel, (channelResponse: IChannel) => {
				setCurrentChannelId(channelResponse.id);
				update();
			});
			closeForm("form_create_channel");
		}
	}

	const closeForm = (formToClose: string) => {
		setIsCreateChannelFormVisible(!isCreateChannelFormVisible);
		const form = document.getElementById(formToClose);
		if (form) {
			form.style.visibility = "hidden";
		}
	};

	function clearMessages(): void {
		socket.emit('clear-messages', currentChannelId);
		socket.emit('get-user-channels', user.current, (response: any) => {
			user.current.userChannels = response;
		})
	}

	function clearChannels(): void {
		socket.emit('clear-channels');
		socket.emit('get-user-channels', user.current, (response: any) => {
			user.current.userChannels = response;
		})
	}

	useEffect(() => {
		console.log("Connecting to server...");
		socket.connect();
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('update', onUpdate);
		document.addEventListener("keydown", handleEscapeKey);
		return () => {
			// Cleans up after the component is unmounted.
			// It removes all the event listeners that were added to the socket object
			// and disconnects the socket from the server.
			document.removeEventListener("keydown", handleEscapeKey);
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
						onClick={createUser}
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
					channels={channels}
					onHandleChannelClick={handleChannelClick}
					socket={socket}
				/>
				<ChatWindow
					currentChannelId={currentChannelId}
					channels={channels}
					onHandleSubmitNewMessage={handleSubmitNewMessage}
					onSetMessageInputValue={setMessageInputValue}
					onClearChannels={clearChannels}
					onClearMessages={clearMessages}
				/>
			</div>
		</>
	);
}

export default Chat;