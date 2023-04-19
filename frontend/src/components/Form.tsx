import { useState } from "react";
import "./style/Form.css"

export interface FormValue {
  value: string,
  label?: string,
  info?: string,
  error?: string,
  placeholder?: string,
  onChange: (v: string) => void,
  isValid?: boolean,
}

export interface FormProps {
  title: string,
  values: FormValue[],
  onSubmit: () => void,
  onClose: () => void,
}

function Form({
  title,
  onSubmit,
  onClose,
  values,
}: FormProps) {
  const [showError, setShowError] = useState(false);

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  function handleOnChange(value: FormValue, e: React.ChangeEvent<HTMLInputElement>) {
    value.onChange(e.target.value);
  }

  return (
    <div className="Form modal">
      <div className="modal-content">
        <div className="modal-close" role="button" onClick={onClose}>&times;</div>
        <div className="modal-title">{title}</div>
        <form onSubmit={(e) => handleOnSubmit(e)}>
          {
            values.map((value, index) => (
              <div key={index}>
                <label>{value.label}</label>
                <h5 style={{ fontWeight: 'lighter' }}>{value.info}</h5>
                <section>
                  <input
                    id="form-input-field"
                    type="text"
                    placeholder={value.placeholder}
                    value={value.value}
                    onChange={(e) => handleOnChange(value, e)}
                  />
                </section>
                {
                  value.isValid ? <h4 style={{ fontWeight: 'lighter', color: '#00e676' }}>Username is valid.</h4>
                                : <h4 style={{ fontWeight: 'lighter', color: 'red' }}>{value.error}&nbsp;</h4>
                }
              </div>
            ))
          }
          <button className="form-submit-button" disabled={values.find(a => a.isValid === false) ? true : false} type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form;