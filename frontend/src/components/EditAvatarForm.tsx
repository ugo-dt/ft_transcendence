import React, { useContext, useState } from "react";
import Form, { FormType } from "./Form";
import Request from "./Request";
import { UserContext } from "../context";
import { useNavigate } from "react-router";

interface EditAvatarProps {
  onClose: () => void,
}

function EditAvatarForm({
  onClose,
}: EditAvatarProps) {
  const user = useContext(UserContext).user;
  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const setUser = useContext(UserContext).setUser;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size <= 2000000) {
        var url = window.URL || window.webkitURL;
        var image = new Image();
        image.onload = function() {
          setIsValid(true);
          setError('');
        };
        image.onerror = function() {
          setIsValid(false);
          setError('This file is invalid.');
        };
        image.src = url.createObjectURL(event.target.files[0]);
      }
      else {
        setIsValid(false);
        setError('File is too large. File size limit is 2MB.');
      }
      setFile(event.target.files[0]);
    }
  }

  const resetAvatar = async () => {
    if (!user) {
      return;
    }
    const res = await Request.resetAvatar();
    if (res) {
      setUser(res);
      navigate("/profile/" + res.username.toLowerCase(), {state: {info: 'Avatar reset to default.'}});
      onClose();
    }
  };

  const formValues: FormType[] = [
    {
      value: file,
      type: 'file',
      label: 'Select an image',
      isValid: isValid,
      valid: 'You can upload this file.',
      error: error,
      onChange: onChange,
    },
    {
      type: 'button',
      info: "Reset to default avatar",
      buttonText: 'Reset',
      onClick: () => resetAvatar(),
    },
  ];

  const submitAvatar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !file || !isValid) {
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await Request.editAvatar(formData);
    if (res) {
      setUser(res);
      navigate("/profile/" + res.username.toLowerCase(), {state: {info: 'Avatar updated successfully.'}});
      onClose();
    };
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