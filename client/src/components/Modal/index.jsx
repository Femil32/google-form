import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import styles from "./Modal.module.scss";

const Modal = ({
  isOpen,
  toggle,
  children,
  width = 550,
  closeClickOnOutSide = true,
  zIndex,
}) => {
  return createPortal(
    <CSSTransition
      in={isOpen}
      unmountOnExit
      timeout={300}
      classNames={{
        enterActive: styles.modal_enter,
        exitActive: styles.modal_exit,
      }}
    >
      <div style={{ "--zIndex": zIndex }}>
        <div
          className={styles.modal}
          onClick={() => {
            isOpen && closeClickOnOutSide && toggle?.();
          }}
        >
          <div
            className={styles.modal_dialog}
            style={{ "--modal-width": `${width}px` }}
          >
            <div
              className={styles.modal_content}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </div>
        <div className={styles.modal_overlay}></div>
      </div>
    </CSSTransition>,
    document.body
  );
};

export default Modal;
