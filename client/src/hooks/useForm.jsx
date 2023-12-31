import { useRef, useState } from "react";
import { debounce, isEmpty } from "utils";

const isCheckBoxOrRadioInput = (type) => {
  return type === "checkbox" || type === "radio";
};

const isCheckBox = (type) => {
  return type === "checkbox";
};

const isFileInput = (type) => {
  return type === "file";
};

const isContendEditable = (editable) => {
  return editable === "true";
};

const defaultErrors = {
  required: `This field is required`,
  minLength: `Tis field should not less than minlength value`,
  maxLength: `This field should not greater than maxlength value`,
  min: `This field should not be less than min value`,
  max: `This field should not be greater than max value`,
  pattern: `This field has mismatched pattern`,
  validate: `Validation failed for this field`,
};

const useForm = (options) => {
  let { onChange } = options || {};

  let debouceOnChange = null;

  if (typeof onChange === "function") {
    debouceOnChange = debounce(onChange, 500);
  }

  let { current: formNames } = useRef([]);

  let { current: formFields } = useRef({});

  let [formData, setFormValue] = useState({});

  let [formErrors, setFormErrors] = useState({});

  let { current: watcher } = useRef({});

  let isSubmitted = useRef(false);

  const setFormField = ({ name, ref, options, field }) => {
    if (!formNames.includes(name)) {
      formNames.push(name);
    }

    let formField;

    if (!isFileInput(ref.type)) {
      let defaultValue = ref.defaultValue;
      if (defaultValue) {
        ref.value = defaultValue;
      }
    }

    if (isCheckBoxOrRadioInput(ref.type)) {
      let defaultChecked = ref.defaultChecked;
      if (defaultChecked) {
        ref.checked = defaultChecked;
      }

      formField = {
        ref: { name, type: ref.type },
        refs:
          field && field.refs
            ? field.refs.findIndex((el) => el === ref) === -1
              ? [...field.refs, ref].filter(({ isConnected }) => isConnected)
              : field.refs
            : [ref],
        options,
      };
    } else {
      formField = {
        ref,
        options,
      };
    }

    set(name, formField, formFields);
  };

  const set = (name, value, fields) => {
    if (typeof fields === "undefined") return;

    if (!name.includes(".")) {
      fields[name] = value;
    } else {
      let keys = name.split(".");
      let key;
      name = keys[0];

      let obj = {
        [name]: isNaN(parseInt(keys[1]))
          ? { ...fields[name] }
          : Array.isArray(fields[name])
          ? fields[name]
          : [],
      };
      let temp = obj[name];
      keys.shift();
      key = keys[0];

      while (keys.length > 1) {
        key = keys[0];
        key = isNaN(parseInt(key)) ? key : parseInt(key);
        if (typeof temp[key] === "undefined") {
          temp[key] = isNaN(parseInt(keys[1])) ? {} : [];
        }
        temp = temp[key];
        keys.shift();
        key = keys[0];
      }

      let keyName = isNaN(parseInt(key)) ? key : parseInt(key);
      temp[keyName] = value;
      fields[name] = obj[name];
    }
  };

  const get = (name, fields) => {
    if (typeof fields === "undefined") return;

    if (name.includes(".")) {
      let value;
      let keys = name.split(".");
      let key = keys.shift();

      if (key) {
        value = fields[key];
        if (typeof value === "undefined") return;
      }

      for (let key of keys) {
        if (typeof value[key] === "undefined") return;
        value = value[key];
      }

      return value;
    } else {
      return fields[name];
    }
  };

  const setFieldValue = (name, ref) => {
    let field = get(name, formFields);
    let value = get(name, formData);

    if (isCheckBoxOrRadioInput(ref.type)) {
      let fieldValue = ref.value || ref.checked;
      if (
        isCheckBox(ref.type) &&
        field &&
        Array.isArray(field.refs) &&
        field.refs.length > 1
      ) {
        if (Array.isArray(value)) {
          if (ref.checked) {
            value.push(fieldValue);
          } else {
            value.splice(value.indexOf(fieldValue), 1);
          }
        } else {
          value = [fieldValue];
        }
      } else {
        if (ref.checked) {
          value = fieldValue;
        } else {
          value = ref.checked;
        }
      }
    } else if (isFileInput(ref.type)) {
      value = ref.files;
    } else if (isContendEditable(ref.contentEditable)) {
      if (ref.innerHTML === "<br>") {
        ref.innerHTML = "";
      }
      value = ref.innerHTML;
    } else {
      value = ref.value;
    }

    set(name, value, formData);
  };

  const validateField = ({ name, ref, updateState = true }) => {
    let prevError = get(name, formErrors);

    if (!ref) return;

    let field = get(name, formFields);

    if (!field) return;

    let { validate, max, min, pattern, required, maxLength, minLength } =
      field.options || {};
    let validateFn =
      typeof validate === "function" ? validate : validate?.value;
    let error;
    let errorType;

    if (
      !isCheckBoxOrRadioInput(ref.type) &&
      typeof ref.checkValidity === "function" &&
      !ref.checkValidity()
    ) {
      let {
        valueMissing,
        patternMismatch,
        rangeUnderflow,
        rangeOverflow,
        tooShort,
        tooLong,
      } = ref.validity;

      if (
        valueMissing &&
        (typeof required === "boolean" ? required : required?.value)
      ) {
        error = typeof required === "object" ? required.message : undefined;
        errorType = "required";
      } else if (
        rangeOverflow &&
        (typeof max === "string" ? max : max?.value)
      ) {
        error = typeof max === "object" ? max.message : undefined;
        errorType = "max";
      } else if (
        rangeUnderflow &&
        (typeof min === "string" ? min : min?.value)
      ) {
        error = typeof min === "object" ? min.message : undefined;
        errorType = "min";
      } else if (
        tooLong &&
        (typeof maxLength === "number" ? maxLength : maxLength?.value)
      ) {
        error = typeof maxLength === "object" ? maxLength.message : undefined;
        errorType = "maxLength";
      } else if (
        tooShort &&
        (typeof minLength === "number" ? minLength : minLength?.value)
      ) {
        error = typeof minLength === "object" ? minLength.message : undefined;
        errorType = "minLength";
      } else if (
        patternMismatch &&
        (pattern instanceof RegExp ? pattern : pattern?.value)
      ) {
        error =
          !(pattern instanceof RegExp) && typeof pattern === "object"
            ? pattern.message
            : undefined;
        errorType = "pattern";
      }
    } else if (typeof validateFn === "function") {
      let value = get(name, formData);
      if (validateFn(value)) {
        error = typeof validate === "object" ? validate.message : undefined;
        errorType = "validate";
      }
    } else {
      let value = get(name, formData);

      if (
        (typeof required === "boolean" ? required : required?.value) &&
        (!value || value.length === 0)
      ) {
        error = typeof required === "object" ? required.message : undefined;
        errorType = "required";
      }
    }

    error = errorType ? error || defaultErrors[errorType] : undefined;

    if (typeof error === "undefined") {
      if (typeof prevError !== "undefined") {
        unset(name, formErrors);
        updateState && setFormErrors({ ...formErrors });
      }
    } else if (prevError !== error) {
      set(name, error, formErrors);
      updateState && setFormErrors({ ...formErrors });
    }
  };

  const register = (name, options = {}) => {
    let {
      max,
      maxLength,
      min,
      minLength,
      pattern,
      required,
      valueAsDate,
      valueAsNumber,
    } = options;

    let formRules = {};

    formRules.name = name;
    if (typeof required === "boolean" || required?.value) {
      formRules.required =
        typeof required === "boolean" ? required : required.value;
    }
    if (typeof max === "string" ? max : max?.value) {
      formRules.max = typeof max === "object" ? max.value : max;
    }
    if (typeof min === "string" ? min : min?.value) {
      formRules.min = typeof min === "object" ? min.value : min;
    }
    if (typeof minLength === "number" ? minLength : minLength?.value) {
      formRules.minLength =
        typeof minLength === "object" ? minLength.value : minLength;
    }
    if (typeof maxLength === "number" ? maxLength : maxLength?.value) {
      formRules.maxLength =
        typeof maxLength === "object" ? maxLength.value : maxLength;
    }
    if (pattern instanceof RegExp ? pattern : pattern?.value) {
      formRules.pattern =
        pattern instanceof RegExp
          ? pattern.source
          : typeof pattern?.value === "string"
          ? new RegExp(pattern.value).source
          : pattern?.value?.source;
    }
    if (valueAsNumber) {
      formRules.valueAsDate = valueAsDate;
    }
    if (valueAsNumber) {
      formRules.valueAsNumber = valueAsNumber;
    }

    return {
      ref: (ref) => {
        if (!ref) return;

        let field = get(name, formFields);

        setFormField({
          name,
          options,
          ref: ref,
          field,
        });
      },
      onBlur: (event) => {
        let ref = event.target;
        if (!isSubmitted.current) return;
        validateField({ name, ref });
      },
      onInput: (event) => {
        let ref = event.target;

        setFieldValue(name, ref);

        let { name: watchName, fn } = watcher;

        if (watchName && fn) {
          if (
            Array.isArray(watchName)
              ? watchName.includes(name)
              : watchName === name
          ) {
            let value = get(name, formData);
            fn(name, event, value);
          }
        }

        if (isSubmitted.current) validateField({ name, ref });

        if (typeof debouceOnChange === "function") debouceOnChange(formData);
      },
      ...formRules,
    };
  };

  const focusField = () => {
    /*let errorKeys = Object.keys(formErrors);

    if (errorKeys.length === 0) return;

    let fieldName: string | undefined;

    for (let field of Object.keys(formFields)) {
      if (errorKeys.includes(field)) {
        fieldName = field;
        break;
      }
    }

    if (!fieldName) return;

    let field = get(fieldName, formFields);

    if (!field) return;

    let ref: HTMLInputElement;

    if (field.refs) {
      ref = field.refs[0];
    } else {
      ref = field.ref;
    }

    ref.focus();
    ref.scrollIntoView({ behavior: "smooth", block: "center" });*/
  };

  const validateAllFields = () => {
    for (let name of formNames) {
      let field = get(name, formFields);

      if (!field) continue;

      if (Array.isArray(field.refs)) {
        for (let ref of field.refs) {
          validateField({ name, ref, updateState: false });
        }
      } else {
        validateField({ name, ref: field.ref, updateState: false });
      }
    }

    setFormErrors({ ...formErrors });

    return isEmpty(formErrors);
  };

  const handleSubmit = (onValid, onInvalid) => {
    return (event) => {
      event.preventDefault();
      if (!isSubmitted.current) {
        isSubmitted.current = true;
      }

      let isValid = validateAllFields();

      if (isValid && typeof onValid === "function") {
        onValid(formData);
      } else if (typeof onInvalid === "function") {
        focusField();
        onInvalid(formErrors);
      }
    };
  };

  const watch = (name, fn) => {
    watcher.name = name;
    watcher.fn = fn;
  };

  const setError = (name, value) => {
    let error = get(name, formErrors);
    if (typeof error === "undefined") return;
    set(name, value, formErrors);
    setFormErrors({ ...formErrors });
  };

  const clearError = (name) => {
    let error = get(name, formErrors);
    if (typeof error === "undefined") return;
    unset(name, formErrors);
    setFormErrors({ ...formErrors });
  };

  const setValue = (name, value) => {
    let field = get(name, formFields);
    set(name, value, formData);
    if (field) validateField({ name, ref: field.ref });
    setFormData({ ...formData });
  };

  const getValue = (name) => {
    let value = get(name, formData);
    if (typeof value === "undefined") return;
    return value;
  };

  const resetFormField = (name, field) => {
    if (isCheckBoxOrRadioInput(field.ref.type)) {
      if (Array.isArray(field.refs)) {
        for (let ref of field.refs) {
          ref.checked = false;
        }
        if (field.refs.length > 1) {
          set(name, [], formData);
        } else {
          set(name, null, formData);
        }
      }
    } else {
      if (isFileInput(field.ref.type)) {
        field.ref.files = null;
      } else {
        field.ref.value = "";
      }
      set(name, null, formData);
    }
  };

  const reset = () => {
    for (let name of formNames) {
      let field = get(name, formFields);
      if (!field) continue;
      resetFormField(name, field);
    }

    isSubmitted.current = false;
    setFormErrors({});
  };

  const resetField = (name) => {
    let field = get(name, formFields);
    if (!field) return;
    resetFormField(name, field);
    clearError(name);
  };

  const validate = (name) => {
    let field = get(name, formFields);
    if (!field) return;
    validateField({ name, ref: field.ref, updateState: true });
  };

  const clearValue = (name) => {
    let field = get(name, formFields);
    if (!field) return;
    unset(name, formFields);
    unset(name, formErrors);
    unset(name, formData);
    setFormData({ ...formData });
  };

  const unset = (name, fields) => {
    if (typeof fields === "undefined") return;

    if (!name.includes(".")) {
      delete fields[name];
    } else {
      let value;
      let keys = name.split(".");
      let initialKey = keys.shift();
      let lastKey = keys.pop();

      if (initialKey) {
        value = fields[initialKey];
        if (typeof value === "undefined") return;
      }

      for (let key of keys) {
        if (typeof value[key] === "undefined") return;
        value = value[key];
      }

      if (!lastKey) return;

      if (Array.isArray(value)) {
        value.splice(parseInt(lastKey), 1);
      } else if (typeof value === "object") {
        delete value[lastKey];
      }
    }
  };

  const setFormData = (data, notifyServer = true) => {
    if (notifyServer) onChange?.(data);
    setFormValue(data);
  };

  return {
    watch,
    reset,
    register,
    setValue,
    getValue,
    validate,
    setError,
    clearError,
    resetField,
    handleSubmit,
    clearValue,
    setFormData,
    formData,
    formErrors,
  };
};

export default useForm;
