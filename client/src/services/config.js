export const baseURL =
  process.env.REACT_APP_NODE_ENV === "development"
    ? "http://localhost:8005"
    : "https://google-form-jxk5.onrender.com";
const userUrl = `${baseURL}/api/user`;
const formUrl = `${baseURL}/api/form`;
const responseUrl = `${baseURL}/api/response`;
const templateUrl = `${baseURL}/api/template`;

const User = {
  login: `${userUrl}/login`,
  register: `${userUrl}/register`,
};

const Form = {
  getAllForms: `${formUrl}/all`,
  createForm: `${formUrl}/create`,
};

const Response = {
  submitResponse: `${responseUrl}/submit`,
  checkStatus: `${responseUrl}/status`,
};

const Template = {
  getAllTemplate: `${templateUrl}/all`,
};

export { User, Form, Response, Template, formUrl, responseUrl };
