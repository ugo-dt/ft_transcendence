import { useNavigate } from "react-router";
import Form, { FormText, FormType } from "../components/Form";
import { useState } from "react";
import Request from "../components/Request";
import { IChannel } from "../types";

interface CreateChannelFormProps {
	onClose?: () => void,
	currentChannel: IChannel | undefined;
}

function ChannelNewPasswordForm({ onClose, currentChannel }: CreateChannelFormProps) {
	const navigate = useNavigate();
	const [passwordValue, setPasswordValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState("");
	const formValues: FormType[] = [
		{
			value: passwordValue,
			label: 'Password',
			placeholder: 'Enter a password',
			isValid: isValid,
			valid: 'Channel name is valid.',
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
				if (v.length <= 2)
					setIsValid(false)
				setPasswordValue(v);
			},
		}, {
			type: 'button',
			buttonText: 'Remove Password',
			onClick: () => removePassword(),
		}];

	async function removePassword() {
		console.log('remove Password');
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