//interface CreateChannelFormProps {
//	createChannelNameInputValue: string;
//	createChannelPasswordInputValue: string;
//	setCreateChannelNameInputValue: (arg0: string) => void;
//	setCreateChannelPasswordInputValue: (arg0: string) => void;
//	createChannel: (arg0: string, arg1: string, arg2: boolean) => void;
//	close: (arg0: string) => void;
//}

//const CreateChannelForm = ({
//	createChannelNameInputValue,
//	createChannelPasswordInputValue,
//	setCreateChannelNameInputValue,
//	setCreateChannelPasswordInputValue,
//	createChannel,
//	close }: CreateChannelFormProps) => {

//	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//		if (event.key === 'Enter') {
//			event.preventDefault();
//			createChannel(createChannelNameInputValue, createChannelPasswordInputValue, false);
//		}
//	};

//	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//		const { name } = e.target;
//		if (name === "name") {
//			setCreateChannelNameInputValue(e.target.value);
//		}
//		if (name === "channelPassword") {
//			setCreateChannelPasswordInputValue(e.target.value);
//		}
//	};

//	return (
//		<form id="form_create_channel">
//			<button type="button" className="button_close_create_channel" onClick={() => close("form_create_channel")}>
//				✕
//			</button>
//			<label id="label_create_channel" htmlFor="text">
//				<b>Channel Name</b>
//			</label>
//			<input
//				className="input_create_channel"
//				type="text"
//				placeholder="Channel Name"
//				name="name"
//				value={createChannelNameInputValue}
//				onKeyDown={handleKeyDown}
//				onChange={(e) => handleInputChange(e)}
//			/>

//			<label id="label_create_channel" htmlFor="psw">
//				<b>Password</b>
//			</label>
//			<input
//				className="input_create_channel"
//				type="password"
//				placeholder="Channel Password"
//				name="channelPassword"
//				value={createChannelPasswordInputValue}
//				onKeyDown={handleKeyDown}
//				onChange={(e) => handleInputChange(e)}
//			/>
//			<button type="button" id="button_create_channel" onClick={() => createChannel(createChannelNameInputValue, createChannelPasswordInputValue, false)}>
//				Create Channel
//			</button>
//		</form>
//	);
//};

import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";
import Request from "../components/Request";
import Form, { FormText } from "../components/Form";
import { IChannel } from "../types/IChannel";

interface CreateChannelFormProps {
	onClose?: () => void,
}

function CreateChannelForm({ onClose }: CreateChannelFormProps) {
	const [channelNameValue, setChannelNameValue] = useState("");
	const [channelPasswordValue, setChannelPasswordValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState("");
	const formValues: FormText[] = [
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
			placeholder: 'Channel Password',
			isPwd: true,
			onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
				const v: string = event.target.value;
				setChannelPasswordValue(v);
			},
		},
	];

	async function submitChannelName(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log(channelNameValue);
		
		Request.createChannel(channelNameValue, channelPasswordValue, false).then((res) => {
			console.log("res: ", res);
			if (res) {
				setChannelNameValue("");
				setChannelPasswordValue("");
				window.location.reload();
			}

		}).catch(err => {
			console.log(err);
		});
	}

	return (
		<div className="modal-overlay">
			<Form
				values={formValues}
				title="Create a new channel"
				onSubmit={submitChannelName}
				onClose={onClose}
			/>
		</div>
	);
}

export default CreateChannelForm;
