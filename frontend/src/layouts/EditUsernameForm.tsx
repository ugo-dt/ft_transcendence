import { useNavigate } from "react-router";
import Form, { FormValue } from "../components/Form";
import { useContext, useState } from "react";
import Request from "../components/Request";
import { IUser } from "../types";
import { UserContext } from "../context";

interface EditUsernameProps {
  onClose: () => void,
}

function EditUsernameForm({
  onClose,
}: EditUsernameProps) {
  const navigate = useNavigate();
  const client = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const formValues: FormValue[] = [
    {
      value: editUsernameValue,
      type: 'text',
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
      isValid: isValid,
    },
  ];

  async function editUsername() {
    if (!isValid) {
      return;
    }
    Request.editUsername(editUsernameValue).then((res: IUser | null) => {
      if (res) {
        navigate("/profile/" + res.username.toLowerCase());
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
        title="Edit username"
        values={formValues}
        onSubmit={editUsername}
        onClose={onClose}
      />
    </div>
  );
}

export default EditUsernameForm;