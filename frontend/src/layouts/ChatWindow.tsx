// //interface ChatWindowProps {
// //	//handleSubmitNewMessage: (arg0: string) => void;
// //	//clearMessages: () => void;
// //	//clearChannels: () => void;
// //	//setMessageInputValue: (arg0: string) => void;
// //	//channels: any[];
// //	//currentChannelId: number;
// //	//messageInputValue: string;
// //}

// //const ChatWindow = ({ channels,
// //	handleSubmitNewMessage,
// //	clearMessages,
// //	clearChannels,
// //	setMessageInputValue,
// //	currentChannelId,
// //	messageInputValue }: ChatWindowProps) => {

// //	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
// //	const inputRef = useRef<HTMLInputElement>(null);

// //	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
// //		if (event.key === 'Enter') {
// //			handleSubmitNewMessage(messageInputValue);
// //		}
// //	};

// //	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //		const { name } = e.target;
// //		if (name === "input_bar") {
// //			setMessageInputValue(e.target.value);
// //		}
// //	};

// //	function scrollToBottom(): void {
// //		if (messagesEndRef.current) {
// //			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
// //		}
// //	}

// //	function playSound(): void {
// //		new Audio(messageSound).play();
// //	}

// //	useEffect(() => {
// //		scrollToBottom();
// //	}, [channels]);

// //	return (
// //		<div id="div_chat_window">
// //			<h1 id="h1_main_title">Chat</h1>
// //			<div id="div_messages_box">
// //				<ul>
// //					{channels && channels.map((channel: IChannel) => {
// //						if (channel.id === currentChannelId) {
// //							return channel.history.map((message: any, messageIndex: number) => (
// //								<div id="div_message" key={messageIndex}>
// //									<img id="img_avatar" src={CHAT_DEFAULT_AVATAR} alt="" width={40} height={40}/>
// //									<li id={"li_messages"}>
// //										<p><b>{message.sender} </b><small>{message.timestamp}</small></p>
// //										{message.content}
// //									</li>
// //								</div>
// //							))
// //						}
// //					})}
// //					<li ref={messagesEndRef} />
// //				</ul>
// //			</div>
// //			<div id="div_input_box">
// //				<input
// //					style={{ pointerEvents: currentChannelId === -1 ? 'none' : 'all' }}
// //					ref={inputRef}
// //					placeholder='Type a message...'
// //					id="div_input_bar"
// //					name="input_bar"
// //					type="text"
// //					value={messageInputValue}
// //					onKeyDown={(e) => handleKeyDown(e)}
// //					onChange={(e) => handleInputChange(e)}
// //				/>
// //				<button
// //					type="button"
// //					onClick={() => handleSubmitNewMessage}>
// //					send
// //				</button>
// //				<button
// //					onClick={scrollToBottom}
// //					type="submit"
// //				>scroll</button>
// //				<button
// //					onClick={clearMessages}
// //					type="submit"
// //				>clear</button>
// //				<button
// //					onClick={clearChannels}
// //					type="submit"
// //				>clear Channels</button>
// //				<p id="debug_date">{Date().toString()}</p>
// //			</div>
// //		</div>
// //	);
// //}

// import React, { useContext } from "react";
// import { useEffect, useRef, useState } from "react";
// import { IChannel } from "../types/IChannel";
// import { CHAT_DEFAULT_AVATAR } from "../constants";
// import messageSound from "../../assets/sound/messageSound.mp3";
// import './style/ChatWindow.css';
// import { Context, UserContext } from "../context";
// import { IUser } from "../types";
// import Request from "../components/Request";
// import { IMessage } from "../types/IMessage";

// interface ChatWindowProps {
// 	channel: IChannel | undefined;
// 	user: IUser;
// };

// function ChatWindow({ channel, user }: ChatWindowProps) {
// 	const socket = useContext(Context).pongSocket.current;
// 	const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
// 	const [messageInputValue, setMessageInputValue] = useState("");

// 	function handleSubmitNewMessage(message: string) {
// 		if (!socket || !socket.connected || !channel)
// 			return;
// 		socket.emit('send-message', { message: message, currentChannelId: channel.id });
// 		console.log("message: ", message);
// 		setMessageInputValue("");
// 	}

// 	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (event.key === 'Enter') {
// 			handleSubmitNewMessage(messageInputValue);
// 		}
// 	};

// 	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const { name } = e.target;
// 		if (name === "input bar") {
// 			setMessageInputValue(e.target.value);
// 		}
// 	};

// 	function scrollToBottom(): void {
// 		if (messagesEndRef.current) {
// 			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
// 		}
// 	}

// 	useEffect(() => {
// 		console.log("llo");
// 	}, [])

// 	return (
// 		<div className="div-chat">
// 			<h1 className="h1-main-title">Chat</h1>
// 			{
// 				channel &&
// 				<div>
// 					<div className="div-chat-window">
// 						<ul>
// 							{
// 								channel.messages.map((id: number) => (
// 									<Message key={id} user={user} id={id} />
// 								))
// 							}
// 							{/*<li ref={messagesEndRef} />*/}
// 						</ul>
// 					</div>
// 					<input
// 						style={{ pointerEvents: channel.id === -1 ? 'none' : 'all' }}
// 						//ref={inputRef}
// 						placeholder='Type a message...'
// 						className="input-bar"
// 						name="input bar"
// 						type="text"
// 						value={messageInputValue}
// 						onKeyDown={(e) => handleKeyDown(e)}
// 						onChange={(e) => handleInputChange(e)}
// 					/>
// 				</div>
// 			}
// 		</div>
// 	);
// }

import "./style/ChatWindow.css"
import { useContext, useEffect, useRef, useState } from "react";
import { IChannel, IUser } from "../types";
import { Context, UserContext } from "../context";
import { IMessage } from "../types/IMessage";
import Request from "../components/Request";

interface MessageProps {
  message: IMessage,
  sender: IUser | undefined,
}

function Message({ message, sender }: MessageProps) {
  const user = useContext(UserContext).user;

  return (
    <>
      {
        (message && sender && user && !user.blocked.includes(sender.id)) &&
        <div className="chat-window-message">
          <img
            id="chat-user-info-avatar"
            src={sender.avatar}
            width={30}
            height={30}
          />
          <li>
            <section className="message-info">
              <b id="sender-username">{sender.username}</b>
              <h6 id="message-timestamp">{message.timestamp}</h6>
            </section>
            {message.content}
          </li>
        </div>
      }
    </>
  )
}

interface ChatWindowProps {
  channelUsers: IUser[],
  getChannelUsers: () => void,
}

function ChatWindow({ channelUsers, getChannelUsers }: ChatWindowProps) {
  const [input, setInput] = useState<string>("");
  const socket = useContext(Context).pongSocket.current;
  const { currentChannel, setCurrentChannel } = useContext(Context);
  const user = useContext(UserContext).user;
  const messagesEndRef = useRef<HTMLSpanElement | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!user) {
      return ;
    }
    if (event.key === 'Enter') {
      handleSubmitNewMessage(input, user.id);
    }
  };

  function handleSubmitNewMessage(message: string, userId: number) {
    if (!socket || !socket.connected || !currentChannel || input.trim() === '' || currentChannel.muted.includes(userId))
      return;
    socket.emit('send-message', { message: message, currentChannelId: currentChannel.id });
    setInput("");
    scrollToBottom();
  }

  function scrollToBottom(): void {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }

  async function getChannelMessages(messageIds: number[]) {
    const messagesData: IMessage[] = [];

    for (const id of messageIds.values()) {
      const message = await Request.getMessage(id);
      if (message) {
        messagesData.push(message);
      }
    }
    setMessages(messagesData);
  }

  async function init() {
    if (!currentChannel) {
      return;
    }
    setLoading(true);
    getChannelUsers();
    getChannelMessages(currentChannel.messages);
    setLoading(false);
  }
  
  function onNewMessage(data: number[]) {
    getChannelMessages(data);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentChannel || !socket || !user) {
      return;
    }    
    if (!currentChannel.users.includes(user.id)) {
      setCurrentChannel(undefined);
      return;
    }
    init();
    socket.on('new-message', onNewMessage);

    return () => {
      socket.off('new-message', onNewMessage);
    }
  }, [currentChannel]);

  return (
    <div className="ChatWindow">
      <h1 className="h1-main-title">Chat</h1>
      <section className="chat-window-messages-container">
        {
          !loading && (
            <div>
              <ul style={{ listStyleType: 'none' }}>
                {
                  currentChannel && messages.length ? messages.map(msg => (
                    <Message key={msg.id} message={msg} sender={channelUsers.find(c => c.id === msg.senderId)} />
                  ))
                    : <h4 style={{ fontWeight: 'lighter' }}>No messages yet.</h4>
                }
              </ul>
              <span ref={messagesEndRef}></span>
            </div>
          )
        }
      </section>
      {
        currentChannel ?
          <input
            disabled={(!!user && currentChannel.muted.includes(user.id))}
            autoComplete="off"
            placeholder={user && currentChannel.muted.includes(user.id) ? 'You are muted.' : `Message ${currentChannel.name}`}
            className="input-bar"
            name="input bar"
            type="text"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
          />
          : <h4 style={{ fontWeight: 'lighter', textAlign: 'center' }}>Find or start a conversation</h4>
      }
    </div>
  )
}

export default ChatWindow;