import styles from "./Radio.module.scss";

const Radio = ({ label = "", id = "", register = {}, ...props }) => {
  return (
    <div className={styles.field}>
      <input
        type="radio"
        {...(id.length > 0 && { id })}
        {...register}
        {...props}
      />
      {label.length > 0 && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default Radio;
