import { useState } from "react";
import { usePopper } from "react-popper";
import { CSSTransition } from "react-transition-group";
import { clickOutside } from "utils";

import styles from "./Select.module.scss";

const Select = ({
  placeholder,
  value,
  disabled,
  size,
  options = [],
  register,
  onChange,
  ...props
}) => {
  let [isOpen, setIsOpen] = useState(false);
  let [referenceElement, setReferenceElement] = useState(null);
  let [popperElement, setPopperElement] = useState(null);

  let {
    attributes,
    styles: style,
    state,
  } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const handleClick = (value) => {
    close();
    onChange?.(value);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

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

  return (
    <div
      ref={setReferenceElement}
      style={{ pointerEvents: !!disabled ? "none" : "all" }}
      {...props}
    >
      <div {...register} tabIndex={-1}>
        <div
          className={styles.custom_select}
          onClick={open}
          style={{ borderColor: "#c4c4c4" }}
        >
          <div className={styles.select_value}>
            {value !== "" ? (
              <span>{value}</span>
            ) : (
              <span className={styles.placeHolder}>{placeholder}</span>
            )}
            <i
              className="bx-chevron-down"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></i>
          </div>
        </div>
        <CSSTransition
          in={isOpen}
          timeout={200}
          unmountOnExit
          classNames={{
            enterActive: styles.enter,
            exitActive: styles.exit,
          }}
          onEntered={onEntered}
        >
          <div
            ref={setPopperElement}
            className={styles.options_container}
            style={{
              ...style.popper,
              ...(size === "auto" && {
                width: state?.rects?.reference?.width,
              }),
            }}
            {...attributes.popper}
          >
            <div className={styles.select_options}>
              {options.map((list, index) => {
                return (
                  <div
                    key={index}
                    className={styles.options}
                    onClick={() => handleClick(list.value)}
                  >
                    <span>{list.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Select;
