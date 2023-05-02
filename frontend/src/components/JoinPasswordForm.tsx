import { useState } from "react";
import Form, { FormText } from "./Form";
import { IChannel } from "../types";
import Request from "./Request";

interface BrowseChannelsProps {
  onClose: () => void,
  submit?: () => void,
  channel: IChannel;
  setChannel: (channel: IChannel | undefined) => void,
  setIsJoinPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>
  getUserChannels: () => void;
}

function JoinPasswordForm({ onClose, channel, setChannel, getUserChannels, setIsJoinPasswordOpen }: BrowseChannelsProps) {
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
    Request.joinChannel(channel.id, passwordValue).then((res) => {
      if (res) {
        setIsJoinPasswordOpen(false);
        onClose();
        setChannel(channel);
      }
      else {
        setIsValid(false);
        setError("Wrong password");
      }
    });
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