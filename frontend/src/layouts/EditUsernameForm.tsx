import { useNavigate } from "react-router";
import Form, { FormValue } from "../components/Form";
import { useState } from "react";
import Requests from "../components/Requests";
import { IClient } from "../types";

interface EditUsernameProps {
  clientName: string,
  onClose: () => void,
}

function EditUsernameForm({
  clientName,
  onClose,
}: EditUsernameProps) {
  const navigate = useNavigate();
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const formValues: FormValue[] = [
    {
      value: editUsernameValue,
      placeholder: 'New username',
      info: 'Username must be between 3 and 15 characters',
      error: error,
      onChange: (v: string) => {
        setIsValid(false);
        if (v.length === 0) {
          setEditUsernameValue(v);
          setError("");
          return;
        }
        Requests.isValidUsername(v).then(res => {
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
      isValid: isValid,
    },
  ];

  function editUsername() {
    if (!isValid) {
      return;
    }
    Requests.editUsername(clientName, editUsernameValue).then((res: IClient | null) => {
      if (res) {
        navigate("/profile/" + res.name.toLowerCase());
      }
    }).catch(err => {
      console.error(err);
    });
    setEditUsernameValue("");
    window.location.reload();
  }

  return (
    <div className="modal-overlay">
      <Form
        title="Edit username"
        values={formValues}
        onSubmit={editUsername}
        onClose={onClose}
      />
    </div>
  );
}

export default EditUsernameForm;