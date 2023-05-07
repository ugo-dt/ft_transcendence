import { useState } from "react";
import Request from "./Request";
import Form, { FormText, FormType } from "./Form";
import { useNavigate } from "react-router";
import { IChannel } from "../types";

interface CreateChannelFormProps {
  setChannel: (channel: IChannel | undefined) => void,
  onClose: () => void,
  getUserChannels: () => void,
}

function CreateChannelForm({
  setChannel,
  onClose,
  getUserChannels,
}: CreateChannelFormProps) {
  const navigate = useNavigate();
  const [channelNameValue, setChannelNameValue] = useState("");
  const [channelPasswordValue, setChannelPasswordValue] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const formValues: FormType[] = [
    {
      value: channelNameValue,
      label: 'Name',
      placeholder: 'Channel Name',
      isValid: isValid,
      valid: 'Channel name is valid.',
      error: error,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const v: string = event.target.value;
        setIsValid(false);
        if (v.length === 0) {
          setChannelNameValue(v);
          setError("");
          return;
        }
        Request.isValidUsername(v).then(res => {
          setError("");
          if (res === 'ok') {
            setIsValid(true);
          }
          else {
            setIsValid(false);
            setError("Channel name is " + res + '.');
          }
        }).catch(err => {
          setIsValid(false);
        });
        setChannelNameValue(v);
      },
    },
    {
      value: channelPasswordValue,
      label: 'Password',
      type: 'password',
      placeholder: 'Channel Password',
      isPwd: true,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const v: string = event.target.value;
        setChannelPasswordValue(v);
      },
    },
    {
      value: isPrivate,
      label: 'Private',
      type: 'checkbox',
      onChange: () => {
        setIsPrivate(!isPrivate);
      }
    }
  ];

  async function submitChannel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    Request.createChannel(channelNameValue, channelPasswordValue, isPrivate).then((res) => {
      if (res) {
        getUserChannels();
        onClose();
      }
    });
  }

  return (
    <div className="modal-overlay">
      <Form
        values={formValues}
        title="Create a new channel"
        onSubmit={submitChannel}
        onClose={onClose}
      />
    </div>
  );
}

export default CreateChannelForm;
