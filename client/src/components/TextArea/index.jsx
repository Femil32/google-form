import { useEffect, useRef } from "react";

import styles from "./TextArea.module.scss";

const TextArea = ({
  placeholder = "Enter Here",
  register,
  className,
  disabled = false,
  ...props
}) => {
  let inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    let inputField = inputRef.current.querySelector("textarea");
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
      <textarea
        placeholder={placeholder}
        className={className || "".trim()}
        onFocus={handleFocus}
        rows={disabled ? 1 : 4}
        disabled={disabled}
        {...(register && register)}
        {...props}
      />
    </div>
  );
};

export default TextArea;
