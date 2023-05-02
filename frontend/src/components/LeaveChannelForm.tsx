interface LeaveChannelFormProps {
  onSubmit: () => void;
  onClose: () => void;
}

function LeaveChannelForm({
  onSubmit,
  onClose,
}: LeaveChannelFormProps) {

  return (
    <div className="modal-overlay">
      <div className="Form modal">
        <div className="modal-content">
          <div className="modal-title">Leave channel?</div>
          <button
            className="form-button"
            onClick={onSubmit}
          > Yes
          </button>
          <button
            className="form-button"
            onClick={onClose}
          > No
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeaveChannelForm;