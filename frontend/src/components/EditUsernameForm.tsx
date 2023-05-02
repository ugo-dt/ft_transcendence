import { useState } from "react";
import { useNavigate } from "react-router";
import Form, { FormText } from "./Form";
import Request from "./Request";
import { IUser } from "../types";

interface EditUsernameProps {
  onClose?: () => void,
}

function EditUsernameForm({
  onClose,
}: EditUsernameProps) {
  const navigate = useNavigate();
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const formValues: FormText[] = [
    {
      value: editUsernameValue,
      label: '',
      type: 'text',
      placeholder: 'New username',
      info: 'Username must be between 3 and 15 characters',
      isValid: isValid,
      valid: 'Username is valid.',
      error: error,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const v: string = event.target.value;
        setIsValid(false);
        if (v.length === 0) {
          setEditUsernameValue(v);
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
            setError("Username is " + res + '.');
          }
        }).catch(err => {
          setIsValid(false);
        });
        setEditUsernameValue(v);
      },
    },
  ];

  async function submitUsername(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    Request.editUsername(editUsernameValue).then((res: IUser | null) => {
      if (res) {
        navigate("/profile/" + res.username.toLowerCase(), {state: {info: 'Username updated successfully.'}})
        window.location.reload();
      }
    }).catch(err => {
      console.error(err);
    });
    setEditUsernameValue("");
  }

  return (
    <div className="modal-overlay">
      <Form
        values={formValues}
        title="Set a new username"
        onSubmit={submitUsername}
        onClose={onClose}
      />
    </div>
  );
}

export default EditUsernameForm;