import styles from "./CheckBox.module.scss";

const CheckBox = ({ label = "", id = "", register = {}, ...props }) => {
  return (
    <div className={styles.field}>
      <input
        type="checkbox"
        {...(id.length > 0 && { id })}
        {...register}
        {...props}
      />
      {label.length > 0 && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default CheckBox;
