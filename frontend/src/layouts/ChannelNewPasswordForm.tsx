import { useNavigate } from "react-router";
import Form, { FormText } from "../components/Form";
import { useState } from "react";
import Request from "../components/Request";

interface CreateChannelFormProps {
	onClose?: () => void,
	currentChannelId: number;
}

function ChannelNewPasswordForm({ onClose, currentChannelId }: CreateChannelFormProps) {
	const navigate = useNavigate();
	const [passwordValue, setPasswordValue] = useState("");
	const [isValid, setIsValid] = useState(true);
	const [error, setError] = useState("");
	const formValues: FormText[] = [
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
				setPasswordValue(v);
			},
		}];

	async function submitNewPassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		Request.editChannelPassword(currentChannelId, passwordValue).then((res) => {
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