import { Fragment, useEffect, useRef, useState } from "react";

import styles from "./Input.module.scss";

const Input = ({
  className,
  type = "text",
  placeholder = "Enter Here",
  register,
  ...props
}) => {
  let inputRef = useRef(null);

  let [mask, setMask] = useState(true);

  useEffect(() => {
    if (!inputRef.current) return;
    let inputField = inputRef.current.querySelector("input");
    if (!inputField) return;
    inputField.addEventListener("blur", handleBlur);
    return () => {
      if (!inputField) return;
      inputField.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleFocus = () => {
    inputRef.current?.classList.remove(styles.blur);
    inputRef.current?.classList.add(styles.focus);
  };

  const handleBlur = () => {
    inputRef.current?.classList.remove(styles.focus);
    inputRef.current?.classList.add(styles.blur);
  };

  return (
    <div ref={inputRef} className={styles.field}>
      <input
        type={type === "password" ? (mask ? "password" : "text") : type}
        placeholder={placeholder}
        className={`${styles.field} ${
          type === "password" ? styles.space : ""
        } ${className || ""}`.trim()}
        onFocus={handleFocus}
        {...(type === "number" && {
          onWheel: (e) => e.target.blur(),
        })}
        {...(register && register)}
        {...props}
      />
      {type === "password" && (
        <Fragment>
          {mask ? (
            <i className="bx-hide" onClick={() => setMask(false)}></i>
          ) : (
            <i className="bx-show" onClick={() => setMask(true)}></i>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Input;
