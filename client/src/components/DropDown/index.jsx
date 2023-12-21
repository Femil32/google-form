import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { CSSTransition } from "react-transition-group";
import { clickOutside } from "utils";

import styles from "./DropDown.module.scss";

const DropDownContext = createContext(null);

const DropDown = ({
  placement = "bottom-start",
  className,
  selector,
  children,
  size,
  ...props
}) => {
  let [referenceElement, setReferenceElement] = useState(null);
  let [popperElement, setPopperElement] = useState(null);

  const {
    attributes,
    styles: style,
    state,
  } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const [show, setShow] = useState(false);

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  useEffect(() => {
    if (selector.length === 0) return;

    const element = document.querySelector(selector);

    if (!element) return;

    element.onclick = open;

    setReferenceElement(element);
  }, [selector]);

  const onEntered = (element) => {
    if (!element) return;

    clickOutside({
      ref: element,
      onClose: close,
      doNotClose: (event) => {
        if (!referenceElement) return false;
        return referenceElement.contains(event);
      },
    });
  };

  return createPortal(
    <CSSTransition
      in={show}
      timeout={200}
      unmountOnExit
      classNames={{
        enterActive: styles.enter,
        exitActive: styles.exit,
      }}
      onEntered={onEntered}
    >
      <DropDownContext.Provider value={{ close: close }}>
        <div
          ref={setPopperElement}
          className={`${styles.container} ${className || ""}`.trim()}
          style={{
            ...style.popper,
            ...(size === "auto" && { width: state?.rects?.reference?.width }),
          }}
          {...attributes.popper}
          {...props}
        >
          <div className={styles.menu}>{children}</div>
        </div>
      </DropDownContext.Provider>
    </CSSTransition>,
    document.body
  );
};

export const Item = ({ children, onClick, className, ...props }) => {
  const { close } = useContext(DropDownContext);

  const handleClick = (event) => {
    close();
    if (typeof onClick === "function") onClick(event);
  };

  return (
    <button
      className={`${styles.item} ${className ? className : ""}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

DropDown.Item = Item;

export default DropDown;
