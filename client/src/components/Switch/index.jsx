import styles from "./Switch.module.scss";

const Switch = ({ id, label = "", className, register = {}, ...props }) => {
  return (
    <div className={`${styles.field} ${className || ""}`.trim()}>
      {label.length > 0 && <label htmlFor={id}>{label}</label>}
      <input id={id} type="checkbox" {...register} {...props} />
    </div>
  );
};

export default Switch;
