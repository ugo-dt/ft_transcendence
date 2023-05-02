import React, { useContext, useState } from "react";
import Form, { FormType } from "./Form";
import Request from "./Request";
import { UserContext } from "../context";
import { useNavigate } from "react-router";

interface EditAvatarProps {
  onClose?: () => void,
}

function EditAvatarForm({
  onClose,
}: EditAvatarProps) {
  const user = useContext(UserContext).user;
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const formValues: FormType[] = [
    {
      value: file,
      type: 'file',
      label: 'Select an image',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
        }
      }
    },
    {
      type: 'button',
      info: "Reset to default avatar",
      buttonText: 'Reset',
      onClick: () => resetAvatar(),
    },
  ];
  
  
  const resetAvatar = async () => {
    if (!user) {
      return;
    }
    Request.resetAvatar().then(res => {
      if (res) {
        window.location.reload();
        navigate("/profile/" + user.username, {state: {info: 'Avatar reset to default.'}});
      }
    }).catch(err => {
      console.error('Could not change avatar: ', err);
    });
  };

  const submitAvatar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !file) {
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    Request.editAvatar(formData).then(res => {
      if (res) {
        window.location.reload();
        navigate("/profile/" + user.username, {state: {info: 'Avatar updated successfully.'}});
      }
    }).catch(err => {
      console.error('Error uploading image:', err);
    });
  };
  
  return (
    <div className="modal-overlay">
      <Form
        values={formValues}
        title="Set a new avatar"
        onSubmit={submitAvatar}
        onClose={onClose}
      />
    </div>
  );
}

export default EditAvatarForm;