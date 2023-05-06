import { useContext, useState } from "react";
import Form, { FormText } from "./Form";
import { IChannel } from "../types";
import { Context } from "../context";
import { IChat } from "../pages/Chat";

interface BrowseChannelsProps {
  chat: IChat,
  onClose: () => void,
  selectedChannel: IChannel;
}

function JoinPasswordForm({ chat, onClose, selectedChannel }: BrowseChannelsProps) {
  const {setChannel, getUserChannels} = chat;
  const socket = useContext(Context).pongSocket;
  const [passwordValue, setPasswordValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const formValues: FormText[] = [
    {
      value: passwordValue,
      label: 'Channel Password',
      placeholder: 'Enter a password',
      isValid: isValid,
      error: error,
      type: 'password',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const v: string = event.target.value;
        setIsValid(false);
        if (v.length === 0) {
          setPasswordValue(v);
          setError("");
          return;
        }
        setIsValid(true);
        setPasswordValue(v);
      },
    }
  ];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (socket.current) {
      socket.current.emit('join-channel', { id: selectedChannel.id, password: passwordValue }, (res: {data: IChannel}) => {
        if (res.data) {
          getUserChannels();
          onClose();
          setChannel(res.data);
        }
      });
    }
    setIsValid(false);
    setError("Wrong password");
}

return (
  <div className="modal-overlay">
    <Form
      values={formValues}
      title="Enter channel password"
      onSubmit={submit}
      onClose={onClose}
    />
  </div>
)
}

export default JoinPasswordForm;