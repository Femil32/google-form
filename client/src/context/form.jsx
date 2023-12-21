import { createContext, useContext } from "react";

const FormContext = createContext({});

export const useFormContext = () => {
  return useContext(FormContext);
};

export const FormProvider = ({ children, ...form }) => {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
};
