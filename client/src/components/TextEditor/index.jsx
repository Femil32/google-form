import { Fragment, useRef } from "react";

import styles from "./TextEditor.module.scss";

const TextEditor = ({
  as,
  disabled = false,
  defaultValue = "",
  placeholder = "Enter Here",
  register = {},
  ...props
}) => {
  let editorRef = useRef(null);
  let toolBarRef = useRef(null);

  const handleFocus = () => {
    editorRef.current?.classList.remove(styles.blur);
    editorRef.current?.classList.add(styles.focus);
    toolBarRef.current?.classList.add(styles.show);
  };

  const handleBlur = () => {
    if (editorRef.current) {
      editorRef.current.classList.remove(styles.focus);
      editorRef.current.classList.add(styles.blur);
    }
    if (toolBarRef.current) {
      toolBarRef.current.classList.remove(styles.show);
    }
  };

  let Component = as || "div";

  return (
    <Fragment>
      {disabled ? (
        <div dangerouslySetInnerHTML={{ __html: defaultValue }}></div>
      ) : (
        <div
          tabIndex={-1}
          ref={editorRef}
          className={styles.container}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <Component
            className={styles.editor}
            contentEditable={true}
            placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: defaultValue }}
            {...register}
            {...props}
          />
        </div>
      )}
    </Fragment>
  );
};

export default TextEditor;
