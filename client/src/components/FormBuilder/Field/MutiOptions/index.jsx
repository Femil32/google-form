import CheckBox from "components/CheckBox";
import Input from "components/Input";
import Radio from "components/Radio";
import Select from "components/Select";
import { useFormContext } from "context/form";
import { Fragment, useMemo } from "react";

import styles from "./MultiOptions.module.scss";

const MultiOptions = ({
  _id,
  fieldId,
  fieldType,
  options,
  other,
  rules,
  sectionIndex,
  fieldIndex,
  formPage: { isEdit },
}) => {
  const { register, setValue, clearValue, formData, formErrors } =
    useFormContext();

  let icon = useMemo(() => {
    switch (fieldType) {
      case "checkbox":
        return "bx-square";
      case "radio":
        return "bx-circle";
      default:
        return "";
    }
  }, [fieldType]);

  let dropdownOptions = useMemo(() => {
    if (fieldType !== "dropdown") return;

    return options?.map((option) => {
      return { label: option, value: option };
    });
  }, [fieldType, options]);

  const name = `sections.${sectionIndex}.fields.${fieldIndex}.response`;
  const field = register(name, rules);
  const value = formData.sections[sectionIndex].fields[fieldIndex].response;

  const handleOtherOption = (value) => {
    setValue(`sections.${sectionIndex}.fields.${fieldIndex}.other`, value);
  };

  const otherField = useMemo(() => {
    if (!other) return null;

    let Component = fieldType === "checkbox" ? CheckBox : Radio;

    let props = {
      id: `${_id}-other`,
      label: "Other",
      defaultChecked:
        fieldType === "checkbox" ? value?.includes("Other") : value === "Other",
      value: "Other",
      register: field,
    };

    return <Component {...props} />;
  }, [_id, field, fieldType, other, value]);

  return (
    <div className={styles.container}>
      {isEdit ? (
        <Fragment>
          {options?.map((option, index) => {
            let errorMsg =
              formErrors?.sections?.[sectionIndex]?.fields?.[fieldIndex]
                ?.options?.[index];
            return (
              <div key={index} className={styles.option_field}>
                <div>
                  {fieldType === "dropdown" ? (
                    <span>{index + 1}.</span>
                  ) : (
                    <i className={icon}></i>
                  )}
                  <Input
                    defaultValue={option}
                    register={register(
                      `sections.${sectionIndex}.fields.${fieldIndex}.options.${index}`,
                      { required: true }
                    )}
                  />
                  <i
                    className="bx-x"
                    style={{ visibility: index === 0 ? "hidden" : "visible" }}
                    onClick={() =>
                      clearValue(
                        `sections.${sectionIndex}.fields.${fieldIndex}.options.${index}`
                      )
                    }
                  ></i>
                </div>
                <div>
                  {errorMsg && (
                    <span className={styles.error_msg}>{errorMsg}</span>
                  )}
                </div>
              </div>
            );
          })}
        </Fragment>
      ) : (
        <Fragment>
          {(fieldType === "checkbox" || fieldType === "radio") &&
            options?.map((option, index) => {
              let props = {
                key: index,
                id: `${fieldId}${index}`,
                label: option,
                value: option,
                register: field,
                defaultChecked:
                  fieldType === "checkbox"
                    ? Array.isArray(value) && value.includes(option)
                    : value === option,
              };

              const Component = fieldType === "checkbox" ? CheckBox : Radio;

              return <Component {...props} />;
            })}
          {fieldType === "dropdown" && (
            <Select
              className={styles.select_field}
              size="auto"
              options={dropdownOptions}
              value={(!Array.isArray(value) && value) || ""}
              register={field}
              onChange={(value) => setValue(name, value)}
            />
          )}
        </Fragment>
      )}
      {other && (
        <Fragment>
          <div className={styles.option_field}>
            {isEdit ? (
              <div>
                <i className={icon}></i>
                <Input placeholder="Other..." disabled />
                <i
                  className="bx-x"
                  onClick={() => handleOtherOption(false)}
                ></i>
              </div>
            ) : (
              <div>
                {otherField}
                <Input
                  placeholder="Enter here"
                  register={register(
                    `sections.${sectionIndex}.fields.${fieldIndex}.otherReason`
                  )}
                />
              </div>
            )}
          </div>
        </Fragment>
      )}
      {isEdit && (
        <div className={styles.wrapper}>
          {fieldType === "dropdown" ? (
            <span>{options && options.length + 1}.</span>
          ) : (
            <i className={icon}></i>
          )}
          <div className={styles.add_option}>
            <div
              onClick={() =>
                setValue(
                  `sections.${sectionIndex}.fields.${fieldIndex}.options.${options?.length} `,
                  `Option ${options && options?.length + 1}`
                )
              }
            >
              <span>Add Option</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiOptions;
