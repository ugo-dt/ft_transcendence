import { useState } from "react";
import Form, { FormText } from "../components/Form";
import { IChannel } from "../types";
import Request from "../components/Request";

interface BrowseChannelsProps {
	onClose?: () => void,
	submit?: () => void,
	joinChannel: (arg0: IChannel) => void,
	channel: IChannel;
	setCurrentChannelId: (arg0: number) => void;
	setIsJoinPasswordOpen: (arg0: boolean) => void;
	refresh: () => void;
}

function JoinPasswordForm({ onClose, joinChannel, channel, setCurrentChannelId, refresh, setIsJoinPasswordOpen }: BrowseChannelsProps) {
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
				if (v.length > 0)
					setIsValid(true);
				setPasswordValue(v);
			},
		}
	];

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		Request.checkPassword(channel.id, passwordValue).then((res) => {
			console.log("res", res);
			if (!res) {
				alert('Wrong Password');
				return;
			}
			Request.joinChannel(channel.id).then((res) => {
				setCurrentChannelId(channel.id);
				setIsJoinPasswordOpen(false);
				refresh();
			});
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