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

interface Message {
  id: number;
  msg: string;
  senderId: string;
  isOwner: boolean;
}

function Chat(): JSX.Element {
  const messagesEndRef = useRef<(null) | HTMLLIElement>(null);
  const [messageInputValue, setMessageInputValue] = useState("");
  const messages = useRef<Message[]>([]);
  const messagesId = useRef(1);
  const clientId = useRef('');
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const socket = useRef(io("http://192.168.1.136:3000", {
    autoConnect: false,
  })).current;
  const printName = useRef(true);

  const handleSubmitNewMessage = (): void => {
    if (socket && socket.connected && messageInputValue.length > 0) {
      console.log("sending", messageInputValue);
      console.log("clientId: ", clientId.current);
      socket.emit('message', { message: messageInputValue, senderId: clientId.current });
      setMessageInputValue("");
      printName.current = false;
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
    messages.current = [];
    clientId.current = socket.id;
    setMessagesState(messages.current);
  }

  function onDisconnect() {
    console.log("Disconnected.");
  }

  function onMessage(data: any) {
    console.log('onmessage');
    let isSentByCurrentUser = false; // <-- default to false

    // Check if the message was sent by the current user
    console.log("senderId: ", data.senderId);

    if (data.senderId === clientId.current) {
      isSentByCurrentUser = true;
    }

    messages.current = [...messages.current, { id: messagesId.current++, msg: data.message, senderId: data.senderId, isOwner: isSentByCurrentUser }];
    setMessagesState(messages.current);
    console.log("Received message:", data.message);
    printName.current = true;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

  useEffect(() => {
    console.log("Connecting to server...");
    socket.connect();
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    return () => {
      // Cleans up after the component is unmounted.
      // It removes all the event listeners that were added to the socket object
      // and disconnects the socket from the server.
      console.log("Disconnecting from server...");
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div id="div_chat_app">
        <h1 id="h1_main_title">Chat app</h1>
        <div id="div_messages_box">
          <ul>
            <li id="li_messages-god">Welcome to this conversation.</li>
            <li id="li_messages-god">This is God speaking.</li>
            {
              messagesState.map(item => (
                  <li id={item.isOwner ? "li_messages-mine" : "li_messages"} key={item.id}>
                    {item.msg}
                  </li>
              ))
            }
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
