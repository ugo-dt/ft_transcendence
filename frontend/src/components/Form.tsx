import "./style/Form.css"

interface FormTypeInfo {
  type?: string,
  label?: string,
  placeholder?: string,
  info?: string,
  isValid?: boolean,
  valid?: string,
  error?: string,
  buttonText?: string,
  isPwd?: boolean | undefined,
}

interface FormBaseType<T> extends FormTypeInfo {
  value?: T | null,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onClick?: () => void;
}

export type FormText = FormBaseType<string>;
export type FormFile = FormBaseType<File>;
export type FormButton = FormBaseType<null>;
export type FormCheckbox = FormBaseType<boolean>;

export type FormType = FormText | FormFile | FormButton | FormCheckbox;

export interface FormProps<T = FormType> {
  values: T[],
  title?: string,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  onClose?: () => void,
}

function Form<T extends FormType>({
  values,
  title,
  onSubmit,
  onClose,
}: FormProps<T>) {

  return (
    <div className="Form modal">
      <div className="modal-content">
        <div className="modal-close" role="button" onClick={onClose}>&times;</div>
        <div className="modal-title">{title}</div>
        <form onSubmit={onSubmit}>
          {
            values.map((value, index) => (
              <div key={index}>
                <label>{value.label}</label>
                <h5 style={{ fontWeight: 'lighter' }}>{value.info}</h5>
                <section>
                  {
                    value.type === 'button' ?
                    <button
                      type="button"
                      className="form-button"
                      onClick={value.onClick}
                    > {value.buttonText}
                    </button> :
                    <input
                    className="form-input-field"
                    type={value.type}
                    placeholder={value.placeholder}
                    value={typeof value.value === 'string' ? value.value : undefined}
                    onChange={value.onChange}
                    />
                  }
                </section>
                {
                  (value.type === 'text' || value.type === 'password' || value.type === 'file') &&
                  (
                    value.isValid
                    ? <h4 style={{ fontWeight: 'lighter', color: '#00e676' }}>{value.valid}&nbsp;</h4>
                    : <h4 style={{ fontWeight: 'lighter', color: 'red' }}>{value.error}&nbsp;</h4>
                  )
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