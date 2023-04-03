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

import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

function Chat(): JSX.Element {
	const messagesEndRef = useRef(null);
	const [messageInputValue, setMessageInputValue] = useState("");
	const messages = useRef<{ id: number; msg: string; }[]>([]);
	const messagesId = useRef(0);
	const [messagesState, setMessagesState] = useState<{ id: number; msg: string; }[]>([]);
	const socket = useRef(io("http://192.168.1.136:3000", {
		autoConnect: false,
	})).current;

	const handleSubmitNewMessage = (): void => {
		if (socket && messageInputValue.length > 0) {
			console.log("sending", messageInputValue);
			socket.emit('message', { message: messageInputValue });
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
		console.log("Connected.");
		messages.current = [];
		setMessagesState(messages.current);
	}

	function onDisconnect() {
		console.log("Disconnected.");
	}

	function onMessage(message: string) {
		console.log('onmessage');

		messages.current = [...messages.current, { id: messagesId.current++, msg: message }];
		setMessagesState(messages.current);
		console.log("Received message:", message);
	}

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	  }, [messagesState]);

	useEffect(() => {
		console.log("Connecting to server...");
		socket.connect();
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('message', (data) => onMessage(data.message));

		return () => {
			console.log("Disconnecting from server...");
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, []);

	console.log("Rendering Chat component...");

	return (
		<>
			<h1>Chat app</h1>
			<div id="div_chat_app">
				<div id="div_messages_box">
					<ul>
					<li id="li_messages">YO</li>
					<li id="li_messages">Wassup bro</li>
					<li id="li_messages">https://www.youtube.com/watch?v=yCGclRZrPvc&</li>
						{
							messagesState.map(item => (
								<li id="li_messages-mine" key={item.id}>{item.msg}</li>
							))
						}
						 <li ref={messagesEndRef} />
					</ul>
				</div>
				<div id="div_input_box">
					<input
						placeholder='Type a message...'
						id="div_input_bar"
						type="text"
						value={messageInputValue}
						onKeyDown={handleKeyDown}
						onChange={(e) => {
							setMessageInputValue(e.target.value);
							console.log("Input field changed:", e.target.value);
						}}
					/>
					<button
						id="button_send"
						onClick={handleSubmitNewMessage}
						type="submit"
					>Send</button>
				</div>
			</div>
		</>
	);
}

export default Chat;
