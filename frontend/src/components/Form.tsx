import "./style/Form.css"

interface FormTypeInfo {
  label?: string,
  placeholder?: string,
  info?: string,
  isValid?: boolean,
  valid?: string,
  error?: string,
  isPwd?: boolean | undefined,
}

interface FormBaseType<T> extends FormTypeInfo {
  value: T | null,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export type FormText = FormBaseType<string>;
export type FormFile = FormBaseType<File>;

type FormType = FormText | FormFile;

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
  function _getValueType(value: T) {
    if (typeof value.value === 'string') {
      return 'text';
    }
    return 'file';
  }

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
                  <input
                    className="form-input-field"
                    type={value.isPwd ? "password" : _getValueType(value)}
                    placeholder={value.placeholder}
                    value={typeof value.value === 'string' ? value.value : undefined}
                    onChange={value.onChange}
                  />
                </section>
                {
                  value.isValid
                  ? <h4 style={{ fontWeight: 'lighter', color: '#00e676' }}>{value.valid}&nbsp;</h4>
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