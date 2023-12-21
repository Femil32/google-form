import Input from "components/Input";
import Switch from "components/Switch";
import TextArea from "components/TextArea";
import TextEditor from "components/TextEditor";
import ToolTip from "components/ToolTip";
import { useFormContext } from "context/form";
import { Fragment, useMemo } from "react";
import FormType from "./FormType";
import MutiOptions from "./MutiOptions";

import styles from "./Field.module.scss";

let formTypes = [
  { type: "textarea", icon: "bx-paragraph", label: "Paragraph" },
  { type: "checkbox", icon: "bx-checkbox-checked", label: "Checkboxes" },
  {
    type: "radio",
    icon: "bx-radio-circle-marked",
    label: "Multiple Choices",
  },
  { type: "dropdown", icon: "bx-down-arrow-circle", label: "Dropdown" },
  { type: "date", icon: "bx-calendar", label: "Date" },
];

const icons = [
  {
    label: "Add new field",
    name: "add",
    icon: "bx-add-to-queue",
    action: "add-field",
  },
  {
    label: "Duplicate",
    name: "duplicate",
    icon: "bx-duplicate",
    action: "duplicate-field",
  },
  {
    label: "Delete",
    name: "delete",
    icon: "bx-trash",
    action: "delete-field",
  },
];

const Field = ({
  field,
  selectedId,
  sectionIndex,
  fieldIndex,
  className,
  formPage,
  focusFieldId,
  isSelected,
  fieldId,
  setDragId,
  ...props
}) => {
  const { register, clearValue, setValue, setFormData, formErrors, formData } =
    useFormContext();

  let { isEdit } = formPage;

  let selectedOption = useMemo(() => {
    return formTypes.find((option) => {
      return option.type === field.fieldType;
    });
  }, [field.fieldType]);

  const error =
    formErrors?.sections?.[sectionIndex]?.fields?.[fieldIndex]?.response;
  const name = `sections.${sectionIndex}.fields.${fieldIndex}.response`;
  const registerField = register(name, field.rules);

  let component = useMemo(() => {
    if (
      field.fieldType === "checkbox" ||
      field.fieldType === "radio" ||
      field.fieldType === "dropdown"
    ) {
      return (
        <MutiOptions
          sectionIndex={sectionIndex}
          fieldIndex={fieldIndex}
          formPage={formPage}
          fieldId={fieldId}
          {...field}
        />
      );
    } else if (field.fieldType === "input") {
      return (
        <Input
          type={
            field.rules?.max?.value || field.rules?.min?.value
              ? "number"
              : "text"
          }
          placeholder="Short answer text"
          defaultValue={field.response}
          register={registerField}
          {...(isEdit ? { disabled: true } : { register: registerField })}
        />
      );
    } else if (field.fieldType === "textarea") {
      return (
        <TextArea
          placeholder="Long answer text"
          defaultValue={field.response}
          {...(isEdit ? { disabled: true } : { register: registerField })}
        />
      );
    } else if (field.fieldType === "date") {
      return (
        <Input
          type="date"
          placeholder="Month, day, year"
          defaultValue={field.response}
          {...(isEdit
            ? { disabled: true }
            : {
                register: registerField,
              })}
        />
      );
    } else {
      return null;
    }
  }, [
    field,
    fieldId,
    fieldIndex,
    formPage,
    isEdit,
    registerField,
    sectionIndex,
  ]);

  const handleFormAction = ({ fieldIndex, sectionIndex, action }) => {
    if (action === "delete-field") {
      clearValue(`sections.${sectionIndex}.fields.${fieldIndex}`);
    } else if (action === "duplicate-field") {
      let formField = JSON.parse(JSON.stringify(field));
      focusFieldId.current = `${sectionIndex}${fieldIndex + 1}`;
      let form = { ...formData };
      form.sections[sectionIndex].fields.splice(fieldIndex + 1, 0, formField);
      setFormData(form);
    } else if (action === "add-field" || action === "add-section") {
      let field = {
        title: "",
        fieldType: "radio",
        options: ["Option 1"],
        other: false,
        description: "",
        rules: {
          required: { value: false },
        },
      };

      if (action === "add-field") {
        let fieldIndex = formData.sections[sectionIndex].fields.length;
        focusFieldId.current = `${fieldIndex}`;
        setValue(`sections.${sectionIndex}.fields.${fieldIndex}`, field);
      } else {
        let section = {
          title: "",
          description: "",
          fields: [field],
        };
        focusFieldId.current = `${formData.sections.length}`;
        setValue(`sections.${formData.sections.length}`, section);
      }
    }
  };

  const handleFormType = (value) => {
    setValue(`sections.${sectionIndex}.fields.${fieldIndex}.fieldType`, value);
  };

  return (
    <div
      className={`${styles.container} ${className || ""}`.trim()}
      {...(!isEdit && { "data-error": !!error })}
      {...props}
    >
      <div className={styles.wrapper}>
        {isEdit ? (
          <Fragment>
            <div data-edit className={styles.field_label}>
              <TextEditor
                as="div"
                defaultValue={field.title}
                register={register(
                  `sections.${sectionIndex}.fields.${fieldIndex}.title`
                )}
              />
              {isSelected && (
                <FormType
                  id={fieldId}
                  options={formTypes}
                  sectionIndex={sectionIndex}
                  fieldIndex={fieldIndex}
                  selectedOption={selectedOption}
                  onChange={handleFormType}
                />
              )}
            </div>
            {field.description && (
              <div className={styles.field_description}>
                <TextEditor
                  as="div"
                  defaultValue={field.description}
                  register={register(
                    `sections.${sectionIndex}.fields.${fieldIndex}.description`
                  )}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <div className={styles.field_label}>
              <span>{field.title}</span>
              {field.rules.required?.value && (
                <span className={styles.asterisk}>*</span>
              )}
            </div>
            {field.description && (
              <div
                dangerouslySetInnerHTML={{ __html: field.description }}
                className={styles.field_description}
              ></div>
            )}
          </Fragment>
        )}
        <div className={styles.field} data-type={field.fieldType}>
          {component}
          {!isEdit && error && (
            <div className={styles.error_msg}>
              <i className="bx-error-circle"></i>
              <span>{error}</span>
            </div>
          )}
        </div>
        {isEdit && isSelected && (
          <Fragment>
            <div className={styles.footer}>
              {icons.map(({ icon, name, action, label }, index) => {
                return (
                  <Fragment key={index}>
                    <i
                      id={`${name}-${fieldId}`}
                      className={icon}
                      onClick={() =>
                        handleFormAction({ sectionIndex, fieldIndex, action })
                      }
                    ></i>
                    <ToolTip selector={`#${name}-${fieldId}`}>{label}</ToolTip>
                  </Fragment>
                );
              })}
              <div className={styles.split}></div>
              <Switch
                id={fieldId}
                label="Required"
                value=""
                defaultChecked={field.rules.required?.value || false}
                register={register(
                  `sections.${sectionIndex}.fields.${fieldIndex}.rules.required.value`
                )}
              />
            </div>
            <div className={styles.highlight}></div>
          </Fragment>
        )}
        {isEdit && (
          <div
            className={styles.drag_icon}
            onPointerDown={() => setDragId?.(fieldId)}
          >
            <i className="bx-dots-horizontal-rounded"></i>
            <i className="bx-dots-horizontal-rounded"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default Field;
