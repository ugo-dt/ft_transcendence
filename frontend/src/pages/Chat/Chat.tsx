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
import React from 'react';

interface IMessage {
	sender: string;
	content: string;
	timestamp: string;
}

function Chat(): JSX.Element {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");
	const clientId = useRef('');
	const [messages, setMessages] = useState<IMessage[]>([]);
	const socket = useRef(io("http://192.168.1.136:3000", {
		autoConnect: false,
	})).current;

	const handleSubmitNewMessage = (): void => {
		if (socket && socket.connected && messageInputValue.length > 0) {
			const IMessage: IMessage = { content: messageInputValue, sender: clientId.current, timestamp: Date().toString()};
			socket.emit('createMessage', IMessage);
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
		socket.emit('getAllMessages', {}, (response: IMessage[]) => {
			setMessages(response);
		})
	}

	function onDisconnect() {
		console.log("Disconnected.");
	}

	function onClear() {
		socket.emit('getAllMessages', {}, (response: IMessage[]) => {
			setMessages(response);
		})
	}

	function onCreatedMessage() {
		socket.emit('getAllMessages', {}, (response: IMessage[]) => {
			setMessages(response);
		})
		playSound();
	}

	function scrollToBottom() {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	function playSound () {
		new Audio(messageSound).play();
	}

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		console.log("Connecting to server...");
		socket.connect();
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('createdMessage', onCreatedMessage);
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

	function clearMessages() {
		socket.emit('clear');
		socket.emit('getAllMessages', {}, (response: IMessage[]) => {
			setMessages(response);
		})
	}

	if (!loggedIn)
		return (
			<>
				<h1>Not Logged in</h1>
				<button onClick={() => setLoggedIn(true)}>Log in</button>
			</>
		)

	return (
		<>
			<div id="div_chat_app">
				<h1 id="h1_main_title">Chat app</h1>
				<div id="div_messages_box">
					<ul>
						{messages.map((message, index) => (
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
					<p>{Date().toString()}</p>
				</div>
			</div>
		</>
	);
}

export default Chat;
