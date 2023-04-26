import { useContext, useState } from "react";
import Form, { FormFile } from "../components/Form";
import Request from "../components/Request";
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
  const formValues: FormFile[] = [
    {
      value: file,
      info: 'Select an image',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
        }
      }
    }
  ]

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