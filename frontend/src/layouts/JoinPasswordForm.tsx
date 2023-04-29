import { useState } from "react";
import Form, { FormText } from "../components/Form";

interface BrowseChannelsProps {
	onClose?: () => void,
	//submit: () => void,
}

function JoinPasswordForm({ onClose }: BrowseChannelsProps) {
	const [PasswordValue, setPasswordValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState("");
	const formValues: FormText[] = [
		{
			value: PasswordValue,
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