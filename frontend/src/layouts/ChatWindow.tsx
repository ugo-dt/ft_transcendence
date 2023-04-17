import { useEffect, useRef, useState } from "react";
import { IChannel } from "../types/IChannel";

interface ChatWindowProps {
	onHandleSubmitNewMessage: (arg0: string) => void;
	onClearMessages: () => void;
	onClearChannels: () => void;
	onSetMessageInputValue: (arg0: string) => void;
	channels: IChannel[];
	currentChannelId: number;
}

const ChatWindow = ({ channels, onHandleSubmitNewMessage, onClearMessages, onClearChannels, onSetMessageInputValue, currentChannelId }: ChatWindowProps) => {

	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [messageInputValue, setMessageInputValue] = useState("");

	function handleSubmitMessage() {
		onHandleSubmitNewMessage(messageInputValue);
		setMessageInputValue("");
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSubmitMessage();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = e.target;
		if (name === "input_bar") {
			setMessageInputValue(e.target.value);
			onSetMessageInputValue(e.target.value);
		}
	};

	function scrollToBottom(): void {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	return (
		<div id="div_chat_window">
			<h1 id="h1_main_title">Chat</h1>
			<div id="div_messages_box">
				<ul>
					{channels && channels[currentChannelId] && channels[currentChannelId].messageHistory.map((message, index) => (
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
					style={{ pointerEvents: currentChannelId === -1 ? 'none' : 'all' }}
					ref={inputRef}
					placeholder='Type a message...'
					id="div_input_bar"
					name="input_bar"
					type="text"
					value={messageInputValue}
					onKeyDown={(e) => handleKeyDown(e)}
					onChange={(e) => handleInputChange(e)}
				/>
				<button
					type="button"
					onClick={handleSubmitMessage}>
					send
				</button>
				<button
					onClick={scrollToBottom}
					type="submit"
				>scroll</button>
				<button
					onClick={onClearMessages}
					type="submit"
				>clear</button>
				<button
					onClick={onClearChannels}
					type="submit"
				>clear Channels</button>
				<p id="debug_date">{Date().toString()}</p>
			</div>
		</div>
	);
}

export default ChatWindow;