import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { CSSTransition } from "react-transition-group";

import styles from "./ToolTip.module.scss";

const ToolTip = ({ selector, children, className, ...props }) => {
  let [referenceElement, setReferenceElement] = useState(null);
  let [popperElement, setPopperElement] = useState(null);

  let [isOpen, setIsOpen] = useState(false);

  const { attributes, styles: style } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  const show = () => {
    setIsOpen(true);
  };

  const hide = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (selector.length === 0) return;

    let element = document.querySelector(selector);

    if (!element) return;

    element.onmouseenter = show;
    element.onmouseleave = hide;
    setReferenceElement(element);
  }, [selector]);

  if (!referenceElement) return null;

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames={{
        enterActive: styles.enter,
        exitActive: styles.exit,
      }}
      unmountOnExit
    >
      <div
        ref={setPopperElement}
        className={`${styles.container} ${className || ""}`.trim()}
        style={{
          ...style.popper,
        }}
        {...attributes.popper}
        {...props}
      >
        <div className={styles.menu}>{children}</div>
      </div>
    </CSSTransition>,
    referenceElement
  );
};

export default ToolTip;
