import { Fragment } from "react";
import DropDown from "components/DropDown";

import styles from "./FormType.module.scss";

const FormType = ({ id, options, selectedOption, onChange }) => {
  return (
    <Fragment>
      <div id={`option-${id}`} className={styles.wrapper}>
        <div className={styles.option}>
          <i className={selectedOption?.icon}></i>
          <span>{selectedOption?.label}</span>
        </div>
        <i className="bxs-down-arrow"></i>
      </div>
      <DropDown selector={`#option-${id}`} size="auto">
        {options.map((option) => {
          return (
            <DropDown.Item
              key={`${option.label}-${id}`}
              onClick={() => onChange(option.type)}
            >
              <i className={option.icon}></i>
              <span>{option.label}</span>
            </DropDown.Item>
          );
        })}
      </DropDown>
    </Fragment>
  );
};

export default FormType;
