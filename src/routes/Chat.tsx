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

function Chat() {
	return (
    <div className="Chat">
		  <h1>
        This is the Chat page.
      </h1>
    </div>
	);
}

export default Chat;