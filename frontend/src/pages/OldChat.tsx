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
// - Add someone to dms
// - Browse channels window
// - All users and their rights on the right
// - Hash channel passwords
// - Show name and avatar under channels

import { useState, useEffect, useRef, useContext } from 'react';
import { io } from "socket.io-client";

import Channels from '../layouts/Channels';
import ChatWindow from '../layouts/ChatWindow';
import CreateChannelForm from '../layouts/CreateChannelForm';
import UserList from '../layouts/UserList';
import { IChannel } from '../types/IChannel';
import { IUser } from '../types/IUser';
import { IMessage } from '../types/IMessage';
import './style/Chat.css'
import { CHAT_DEFAULT_AVATAR } from '../constants';
import BrowseChannels from '../layouts/BrowseChannels';
import { UserContext } from '../context';

//function Chat() {
//	const [loggedIn, setLoggedIn] = useState<boolean>(false);
//	const [messageInputValue, setMessageInputValue] = useState("");

//	const [createChannelNameInputValue, setCreateChannelNameInputValue] = useState("");
//	const [createChannelPasswordInputValue, setCreateChannelPasswordInputValue] = useState("");

//	const [createUserNameInputValue, setCreateUserInputValue] = useState("");
//	const [channelPasswordInputValue, setChannelPasswordInputValue] = useState("");
//	const user = useRef<IUser>({} as IUser);
//	const DTBuser = useContext(UserContext).user;
//	const [channels, setChannels] = useState<IChannel[]>([]);
//	const [allChannels, setAllChannels] = useState<IChannel[]>([]);

//	const [currentChannelId, setCurrentChannelId] = useState<number>(-1);

//	const socket = useRef(io("http://192.168.1.136:3000/chat", {
//		autoConnect: false,
//	})).current;

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

//	function handleKeyDown2(event: React.KeyboardEvent<HTMLInputElement>) {
//		if (event.key === "Enter") {
//			event.preventDefault();
//			createUser();
//		}
//	};

//	function handleEscapeKey(event: KeyboardEvent) {
//		if (event.key === "Escape") {
//			event.preventDefault();
//			closeForm("form_create_channel");
//			closeForm("form_channel_settings");
//			closeForm("div_main_browse_channels");
//			closeForm("form_channel_password");
//		}
//	}

//	function onConnect(): void {
//		console.log(`Connected with ID: ${socket.id}`);
//		if (loggedIn) {
//			update();
//		}
//	}

//	function onDisconnect(): void {
//		console.log("Disconnected.");
//	}

//	function onUpdate(): void {
//		console.log('update');
//		update();
//	}

//	function update(): void {
//		socket.emit('get-user-channels', user.current, (response: IChannel[]) => {
//			setChannels(response);
//		});
//		socket.emit('get-all-channels', {}, (response: IChannel[]) => {
//			setAllChannels(response);
//			console.log("response: ", response);
//		});
//	}

//	function createUser(): void {
//		socket.emit('create-user', DTBuser?.username, (response: IUser) => {
//			user.current = response;
//			update();
//		});
//		setLoggedIn(true);
//	}

//	function createChannel(createChannelNameInputValue: string,
//		createChannelPasswordInputValue: string,
//		isDm: boolean): void {
//		if (createChannelNameInputValue.match(/^ *$/))
//			alert("Channel Name can't be empty.");
//		else if (createChannelNameInputValue.length > 15 || createChannelNameInputValue.length < 3)
//			alert("Channel Name must be between 3 and 15 characters.");
//		else if (user) {
//			const newChannel = {
//				channelId: -1,
//				name: createChannelNameInputValue.trim(),
//				history: [],
//				password: createChannelPasswordInputValue,
//				isDm: isDm,
//				users: [user.current],
//				admins: [user.current],
//				banned: [],
//				muted: [],
//			};
//			socket.emit('create-channel', newChannel, (channelResponse: IChannel) => {
//				setCurrentChannelId(channelResponse.id);
//			});
//			update();
//			closeForm("form_create_channel");
//			setCreateChannelNameInputValue("");
//			setCreateChannelPasswordInputValue("");
//		}
//	}

//	const openForm = (formToOpen: string) => {
//		const form = document.getElementById(formToOpen);
//		if (form) {
//			form.style.visibility = "visible";
//		}
//	};

//	const closeForm = (formToClose: string) => {
//		const form = document.getElementById(formToClose);
//		if (form) {
//			form.style.visibility = "hidden";
//		}
//	};

//	function clearMessages(): void {
//		socket.emit('clear-messages', currentChannelId);
//		socket.emit('get-user-channels', user.current, (response: any) => {
//			user.current.userChannels = response;
//		})
//	}

//	function clearChannels(): void {
//		socket.emit('clear-channels');
//		socket.emit('get-user-channels', user.current, (response: any) => {
//			user.current.userChannels = response;
//		})
//	}

//	useEffect(() => {
//		console.log("currentChannelId: ", currentChannelId);
//		console.log("channels.length : ", channels.length);
//		console.log("channels: ", channels);
//	}, [channels]);

//	useEffect(() => {
//		console.log("Connecting to server...");
//		socket.connect();
//		socket.on('connect', onConnect);
//		socket.on('disconnect', onDisconnect);
//		socket.on('update', onUpdate);
//		document.addEventListener("keydown", handleEscapeKey);
//		return () => {
//			// Cleans up after the component is unmounted.
//			// It removes all the event listeners that were added to the socket object
//			// and disconnects the socket from the server.
//			document.removeEventListener("keydown", handleEscapeKey);
//			console.log("Disconnecting from server...");
//			socket.removeAllListeners();
//			socket.disconnect();
//		};
//	}, []);

//	//if (!loggedIn) // remove
//	//	return (
//	//		<>
//	//			<h1>Not Logged in</h1>
//	//			{DTBuser?.username}
//	//			<form>
//	//				<label><b>User Name</b></label>
//	//				<input
//	//					required
//	//					type="text"
//	//					placeholder="User Name"
//	//					name="userName"
//	//					value={createUserNameInputValue}
//	//					onKeyDown={handleKeyDown2}
//	//					onChange={(e) => {
//	//						setCreateUserInputValue(e.target.value);
//	//					}}
//	//				/>
//	//				<button
//	//					type="button"
//	//					onClick={createUser}
//	//				>Log in
//	//				</button><br />
//	//				<button
//	//					type="button"
//	//					onClick={createUser}
//	//				>Guest
//	//				</button>
//	//			</form>
//	//		</>
//	//	)

//	return (
//		<div id="div_main">
//			{/*<CreateChannelForm
//					createChannelNameInputValue={createChannelNameInputValue}
//					createChannelPasswordInputValue={createChannelPasswordInputValue}
//					setCreateChannelNameInputValue={setCreateChannelNameInputValue}
//					setCreateChannelPasswordInputValue={setCreateChannelPasswordInputValue}
//					createChannel={createChannel}
//					close={closeForm}
//				/>
//				<BrowseChannels
//					currentChannelId={currentChannelId}
//					allChannels={allChannels}
//					openForm={openForm}
//					closeForm={closeForm}
//					socket={socket}
//					setCurrentChannelId={setCurrentChannelId}
//					user={user.current}
//					channelPasswordInputValue={channelPasswordInputValue}
//					setChannelPasswordInputValue={setChannelPasswordInputValue}
//				/>
//				<div>
//					<Channels
//						currentChannelId={currentChannelId}
//						channels={channels}
//						setCurrentChannelId={setCurrentChannelId}
//						socket={socket}
//						update={update}
//						openForm={openForm}
//					/>
//					<button id='button_user_profile'>
//						<img id="img_user_profile" src={CHAT_DEFAULT_AVATAR} alt="" width={40} height={40} />
//						<b><p>{user.current.username}</p></b>
//					</button>
//				</div>
//				<ChatWindow
//					currentChannelId={currentChannelId}
//					channels={channels}
//					messageInputValue={messageInputValue}
//					handleSubmitNewMessage={handleSubmitNewMessage}
//					setMessageInputValue={setMessageInputValue}
//					clearChannels={clearChannels}
//					clearMessages={clearMessages}
//				/>
//				<UserList
//					currentChannelId={currentChannelId}
//					channels={channels}
//					setCurrentChannelId={setCurrentChannelId}
//					update={update}
//				/>*/}
//		</div>
//	);
//}

import { Context } from "../context";
import Request from "../components/Request";
import { useLocation, useNavigate } from 'react-router';
import UserTagAndChannels from '../layouts/UserTagAndChannels';

function Chat() {
	const state = useLocation().state;
	const context = useContext(Context);
	const user = useContext(UserContext).user;
	const [profile, setProfile] = useState<IUser | null>(null);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [info, setInfo] = useState("");
	const url = window.location.pathname;
	const [channels, setChannels] = useState<IChannel[]>([]);

	useEffect(() => {
		if (url === '/messages' || url === '/messages/') {
			return navigate("/home");
		}
		const profileName = window.location.pathname.split("/").pop()!;
		document.title = "ft_transcendence - " + profileName;
		setProfile(user);
		if (!context.socketConnected) {
			return;
		}
		window.history.replaceState({}, document.title);
		async function getProfile() {
			setLoading(true);
			setLoading(false);
		}
		getProfile();
	}), [context, url];

	return (
		<div className='chat'>
			{
				<>
					<UserTagAndChannels profile={user} />
					<ChatWindow />
					{/*<UserList />*/}
				</>
			}
		</div>
	)
}

export default Chat;