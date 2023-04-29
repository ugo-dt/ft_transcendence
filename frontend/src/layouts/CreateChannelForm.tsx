import { useContext, useState } from "react";
import Request from "../components/Request";
import Form, { FormText } from "../components/Form";
import { Context } from "../context";
import { useNavigate } from "react-router";

interface CreateChannelFormProps {
	onClose?: () => void,
}

function CreateChannelForm({ onClose }: CreateChannelFormProps) {
	const { setCurrentChannelId } = useContext(Context);
	const navigate = useNavigate();
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
			type: 'password',
			placeholder: 'Channel Password',
			isPwd: true,
			onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
				const v: string = event.target.value;
				setChannelPasswordValue(v);
			},
		},
	];

	async function submitChannel(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		Request.createChannel(channelNameValue, channelPasswordValue, false).then((res) => {
			console.log("res: ", res);
			if (!res)
				return;
			//setCurrentChannelId(res.id);
			//navigate("/messages", { state: {id: res.id}});
			window.location.reload();
			setChannelNameValue("");
			setChannelPasswordValue("");
		}).catch(err => {
			console.log(err);
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
