import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Form, { FormText } from "./Form";
import Request from "./Request";
import { UserContext } from "../context";

interface EditUsernameProps {
  onClose: () => void,
}

function EditUsernameForm({
  onClose,
}: EditUsernameProps) {
  const navigate = useNavigate();
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const setUser = useContext(UserContext).setUser;
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
    const res = await Request.editUsername(editUsernameValue);
    if (res) {
      setUser(res);
      navigate("/profile/" + res.username.toLowerCase(), {state: {info: 'Username updated successfully.'}})
      onClose();
    }
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