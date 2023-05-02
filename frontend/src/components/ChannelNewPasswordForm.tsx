import Form, { FormType } from "./Form";
import { useState } from "react";
import Request from "./Request";
import { IChannel } from "../types";

interface CreateChannelFormProps {
	onClose?: () => void,
	currentChannel: IChannel | undefined;
}

function ChannelNewPasswordForm({ onClose, currentChannel }: CreateChannelFormProps) {
	const [passwordValue, setPasswordValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState("");
	const formValues: FormType[] = [
		{
			value: passwordValue,
			label: 'Password',
			placeholder: 'Enter a password',
			isValid: isValid,
			valid: 'Password is valid.',
			error: error,
			type: 'password',
			onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
				const v: string = event.target.value;
				if (v.length === 0) {
					setPasswordValue(v);
					setError("");
					return;
				}
				if (v.length > 2)
					setIsValid(true)
				if (v.length <= 2) {
					setError("Password is too short.");
					setIsValid(false);
				}
				setPasswordValue(v);
			},
		}, {
			type: 'button',
			buttonText: 'Remove Password',
			onClick: () => removePassword(),
		}];

	async function removePassword() {
		if (!currentChannel) {
			return ;
		}
		Request.editChannelPassword(currentChannel.id, "").then((res) => {
			if (!res)
				return;
			setPasswordValue("");
			if (onClose)
				onClose();
		});
	}

	async function submitNewPassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!currentChannel) {
			return ;
		}
		Request.editChannelPassword(currentChannel.id, passwordValue).then((res) => {
			if (!res)
				return;
			setPasswordValue("");
			if (onClose)
				onClose();
		});
	}

	return (
		<div className="modal-overlay">
			<Form
				values={formValues}
				title="Set a new Password"
				onSubmit={submitNewPassword}
				onClose={onClose}
			/>
		</div>
	);
}

export default ChannelNewPasswordForm;