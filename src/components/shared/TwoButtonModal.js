import React from 'react';
import './TwoButtonModal.scss';

const Modal = ({ isShowing, hide, title, text, handleConfirm, oneButton }) =>
  isShowing ? (
    <>
      <div className="ModalBackground">
        <div
          className="ModalContent"
          aria-modal
          aria-hidden
          tabIndex={-1}
          role="dialog"
        >
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="ButtonGroup">
          {!oneButton &&
            <button
              type="button"
              className="Button--Cancel"
              data-dismiss="modal"
              aria-label="Cancel"
              onClick={hide}
            >
              Cancel
            </button>}
            <button
              type="button"
              className="Button--Success"
              data-dismiss="modal"
              aria-label="Confirm"
              onClick={handleConfirm}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;

export default Modal;
