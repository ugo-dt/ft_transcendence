import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";

interface CreateChannelFormProps {
	onSetCreateChannelNameInputValue: (arg0: string) => void;
	onSetCreateChannelPasswordInputValue: (arg0: string) => void;
	onSubmit: (arg0: string, arg1: string) => void;
	onClose: () => void;
}

const CreateChannelForm = ({
	onSetCreateChannelNameInputValue,
	onSetCreateChannelPasswordInputValue,
	onSubmit,
	onClose }: CreateChannelFormProps) => {
	const [createChannelNameInputValue, setCreateChannelNameInputValue] = useState("");
	const [createChannelPasswordInputValue, setCreateChannelPasswordInputValue] = useState("");

	function handleSubmit() {
		onSubmit(createChannelNameInputValue, createChannelPasswordInputValue);
		setCreateChannelNameInputValue("");
		setCreateChannelPasswordInputValue("");
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSubmit();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = e.target;
		if (name === "name") {
			setCreateChannelNameInputValue(e.target.value);
			onSetCreateChannelNameInputValue(e.target.value);
		}
		if (name === "channelPassword") {
			setCreateChannelPasswordInputValue(e.target.value);
			onSetCreateChannelPasswordInputValue(e.target.value);
		}
	};

	return (
		<form id="form_create_channel">
			<button type="button" className="button_close_create_channel" onClick={onClose}>
				✕
			</button>
			<label id="label_create_channel" htmlFor="text">
				<b>Channel Name</b>
			</label>
			<input
				className="input_create_channel"
				type="text"
				placeholder="Channel Name"
				name="name"
				value={createChannelNameInputValue}
				onKeyDown={handleKeyDown}
				onChange={(e) => handleInputChange(e)}
			/>

			<label id="label_create_channel" htmlFor="psw">
				<b>Password</b>
			</label>
			<input
				className="input_create_channel"
				type="password"
				placeholder="Channel Password"
				name="channelPassword"
				value={createChannelPasswordInputValue}
				onKeyDown={handleKeyDown}
				onChange={(e) => handleInputChange(e)}
			/>

			<button type="button" id="button_create_channel" onClick={handleSubmit}>
				Create Channel
			</button>
		</form>
	);
};

export default CreateChannelForm;
