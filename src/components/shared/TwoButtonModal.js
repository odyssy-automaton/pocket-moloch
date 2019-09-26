import React from 'react';
import './TwoButtonModal.scss';

const Modal = ({ isShowing, hide, title, text, handleConfirm }) =>
  isShowing
    ? 
        <>
          <div className="ModalBackground">
          <div
            className="ModalContent"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
          <p className="ModalTitle">{title}</p>
          <p className="ModalText">{text}</p>
          <div className="ButtonFlex">
            <button
              type="button"
              className="Cancel"
              data-dismiss="modal"
              aria-label="Cancel"
              onClick={hide}
            >Cancel
            </button>
            <button
              type="button"
              className="Confirm"
              data-dismiss="modal"
              aria-label="Confirm"
              onClick={handleConfirm}
            >Continue
            </button>
</div>
          </div>
          </div>
        </>
    : null;

export default Modal;
