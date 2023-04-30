//interface ChatWindowProps {
//	//handleSubmitNewMessage: (arg0: string) => void;
//	//clearMessages: () => void;
//	//clearChannels: () => void;
//	//setMessageInputValue: (arg0: string) => void;
//	//channels: any[];
//	//currentChannelId: number;
//	//messageInputValue: string;
//}

//const ChatWindow = ({ channels,
//	handleSubmitNewMessage,
//	clearMessages,
//	clearChannels,
//	setMessageInputValue,
//	currentChannelId,
//	messageInputValue }: ChatWindowProps) => {

//	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
//	const inputRef = useRef<HTMLInputElement>(null);

//	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//		if (event.key === 'Enter') {
//			handleSubmitNewMessage(messageInputValue);
//		}
//	};

//	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//		const { name } = e.target;
//		if (name === "input_bar") {
//			setMessageInputValue(e.target.value);
//		}
//	};

//	function scrollToBottom(): void {
//		if (messagesEndRef.current) {
//			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//		}
//	}

//	function playSound(): void {
//		new Audio(messageSound).play();
//	}

//	useEffect(() => {
//		scrollToBottom();
//	}, [channels]);

//	return (
//		<div id="div_chat_window">
//			<h1 id="h1_main_title">Chat</h1>
//			<div id="div_messages_box">
//				<ul>
//					{channels && channels.map((channel: IChannel) => {
//						if (channel.id === currentChannelId) {
//							return channel.history.map((message: any, messageIndex: number) => (
//								<div id="div_message" key={messageIndex}>
//									<img id="img_avatar" src={CHAT_DEFAULT_AVATAR} alt="" width={40} height={40}/>
//									<li id={"li_messages"}>
//										<p><b>{message.sender} </b><small>{message.timestamp}</small></p>
//										{message.content}
//									</li>
//								</div>
//							))
//						}
//					})}
//					<li ref={messagesEndRef} />
//				</ul>
//			</div>
//			<div id="div_input_box">
//				<input
//					style={{ pointerEvents: currentChannelId === -1 ? 'none' : 'all' }}
//					ref={inputRef}
//					placeholder='Type a message...'
//					id="div_input_bar"
//					name="input_bar"
//					type="text"
//					value={messageInputValue}
//					onKeyDown={(e) => handleKeyDown(e)}
//					onChange={(e) => handleInputChange(e)}
//				/>
//				<button
//					type="button"
//					onClick={() => handleSubmitNewMessage}>
//					send
//				</button>
//				<button
//					onClick={scrollToBottom}
//					type="submit"
//				>scroll</button>
//				<button
//					onClick={clearMessages}
//					type="submit"
//				>clear</button>
//				<button
//					onClick={clearChannels}
//					type="submit"
//				>clear Channels</button>
//				<p id="debug_date">{Date().toString()}</p>
//			</div>
//		</div>
//	);
//}

import React, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { IChannel } from "../types/IChannel";
import { CHAT_DEFAULT_AVATAR } from "../constants";
import messageSound from "../../assets/sound/messageSound.mp3";
import './style/ChatWindow.css';
import { Context, UserContext } from "../context";
import { IUser } from "../types";
import Request from "../components/Request";
import { IMessage } from "../types/IMessage";

interface MessageProps {
	id: number,
	user: IUser,
}

function Message({
	id,
	user
}: MessageProps) {
	const context = useContext(UserContext);
	const [message, setMessage] = useState<IMessage | null>(null);
	const [sender, setSender] = useState<IUser | null>(null);

	useEffect(() => {
		Request.getMessage(id).then(res => {
			if (res) {
				setMessage(res);
				console.log("res: ", res);
			}
		});
		if (!message) {
			return;
		}
		Request.getProfileFromId(message.senderId).then(res => {
			if (res) {
				setSender(res);
			}
		});
	}, [context]);

	return (
		<>
			{
				message && sender &&
				<div className="div-message">

					<img className="user-avatar" src={user.avatar} width={40} height={40} />
					<li className={"li-messages"}>
						<p><b>{sender.username}</b> {message.timestamp}</p>
						{message.content}
					</li>
				</div>
			}
		</>
	)
}

interface ChatWindowProps {
	channel: IChannel | undefined;
	user: IUser;
};

function ChatWindow({ channel, user }: ChatWindowProps) {
	const socket = useContext(Context).pongSocket.current;
	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");

	function handleSubmitNewMessage(message: string) {
		if (!socket || !socket.connected || !channel)
			return;
		socket.emit('send-message', { message: message, currentChannelId: channel.id });
		console.log("message: ", message);
		setMessageInputValue("");
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSubmitNewMessage(messageInputValue);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = e.target;
		if (name === "input bar") {
			setMessageInputValue(e.target.value);
		}
	};

	function scrollToBottom(): void {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	useEffect(() => {
		console.log("llo");
	}, [])

	return (
		<div className="div-chat">
			<h1 className="h1-main-title">Chat</h1>
			{
				channel &&
				<div>
					<div className="div-chat-window">
						<ul>
							{
								channel.messages.map((id: number) => (
									<Message key={id} user={user} id={id} />
								))
							}
							{/*<li ref={messagesEndRef} />*/}
						</ul>
					</div>
					<input
						style={{ pointerEvents: channel.id === -1 ? 'none' : 'all' }}
						//ref={inputRef}
						placeholder='Type a message...'
						className="input-bar"
						name="input bar"
						type="text"
						value={messageInputValue}
						onKeyDown={(e) => handleKeyDown(e)}
						onChange={(e) => handleInputChange(e)}
					/>
				</div>
			}
		</div>
	)
}

export default ChatWindow;