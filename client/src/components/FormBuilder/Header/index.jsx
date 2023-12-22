import Avatar from "components/Avatar";
import ToolTip from "components/ToolTip";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { debounce, googleFormIcon } from "utils";

import styles from "./Header.module.scss";

const Header = ({
  formId,
  params,
  title,
  user,
  navigate,
  logout,
  handleTitle,
}) => {
  const tabs = ["Questions", "Responses"];

  const [hide, setHide] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    if (hide) return;
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [hide]);

  const toggleTitle = () => {
    setHide(!hide);
  };

  const handleChange = debounce(({ target: { value } }) => {
    if (value.length === 0)
      return toast("Title should not be empty", { type: "error" });
    handleTitle(value);
  }, 500);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>
          <div onClick={() => navigate("/form/list")}>{googleFormIcon}</div>
          <input
            ref={inputRef}
            name="title"
            defaultValue={title || "Google Form"}
            onChange={handleChange}
            onBlur={toggleTitle}
            hidden={hide}
          />
          {hide && <h1 onClick={toggleTitle}>{title}</h1>}
        </div>
        <div className={styles.icon}>
          <i
            id="preview-form"
            className="bx-show"
            onClick={() => window.open(`/form/${formId}/view`)}
          ></i>
          <ToolTip selector="#preview-form">Preview</ToolTip>
          <Avatar userName={user?.name} logout={logout} />
        </div>
      </div>
      <ul className={styles.bottom}>
        {tabs.map((label, index) => {
          let isActive =
            (params.get("tab") || "questions") === label.toLocaleLowerCase();
          return (
            <li
              key={index}
              className={`${styles.tab} ${
                isActive ? styles.active : ""
              }`.trim()}
              onClick={() =>
                navigate({
                  search: label === "Responses" ? `?tab=responses` : "",
                })
              }
            >
              {label}
              {isActive && <div className={styles.indicator}></div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Header;
