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

import { Avatar, Box, Divider, Grid, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, TextField } from "@mui/material";

const placeholder = [{
  id: 0,
  nickname: "Marc",
  status: "online",
  messagesHistory: [{
    sender: "You",
    time: 123,
    message: "Salut, que fais-tu ?"
  },
  {
    sender: "Marc",
    time: 2345,
    message: "Rien et toi"
  },
  {
    sender: "You",
    time: 65433,
    message: "Pareil, go boire un verre BG !"
  },
  {
    sender: "You",
    time: 95433,
    message: "En fait oublie... j'ai piscine..."
  }]
},
{
  id: 1,
  nickname: "Alexandra",
  status: "offline",
  messagesHistory: [{
    sender: "You",
    time: 4532,
    message: "Tok tok tok !"
  }]
},
{
  id: 2,
  nickname: "Ugo",
  status: "offline",
  messagesHistory: [{
    sender: "Ugo",
    time: 12355,
    message: "Mec, tu ne vas pas en croire tes yeux !!"
  },
  {
    sender: "You",
    time: 2346567,
    message: "Hum ??"
  },
  {
    sender: "Ugo",
    time: 23864432,
    message: "Elon Musk ne m'a rien dit."
  }]
},
{
  id: 3,
  nickname: "Sophie",
  status: "online",
  messagesHistory: [{
    sender: "Sophie",
    time: 123,
    message: "Hey, explique-moi comment monter bronze stp."
  },
  {
    sender: "Sophie",
    time: 45678,
    message: "Ha ouais, tu me snobes ?"
  }]
}];

function Chat() {
  return (
    <>
      <Grid container spacing={4} sx={{ minHeight: "100vh" }}>
        <Grid item xs={2} sx={{ borderRight: 1, borderColor: "grey.300" }}>
          <List>
            {placeholder.map((person, id) => {
              return (
                <Box key={person.id}>
                  {!!id && <Divider variant="middle" component="li" />}
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar>

                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={person.nickname} secondary={person.status} />
                  </ListItemButton>
                </Box>
              );
            })}
          </List>
        </Grid>
        <Grid item xs>
          <Grid container direction="column" sx={{ minHeight: "100vh" }}>
            <Grid item sx={{ flexGrow: 1 }} />
            <Grid item>
              <List>
                {placeholder[0].messagesHistory.map(message => {
                  return (
                    <ListItem key={message.time}>
                      <ListItemAvatar>
                        <Avatar>

                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={message.sender + " (" + message.time + ")"} secondary={message.message} />
                    </ListItem>
                  );
                })}
              </List>
              <Divider variant="middle" />
              <TextField fullWidth id="Type a message" label="Type a message" margin="normal" size="small" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Chat;