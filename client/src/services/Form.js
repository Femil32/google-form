import { axios } from "./index";
import { Response, Form, formUrl, responseUrl } from "./config";

const getFormById = (formId) => {
  return axios({
    method: "get",
    url: `${formUrl}/${formId}`,
  });
};

const sendResponse = (data) => {
  return axios({
    method: "post",
    url: Response.submitResponse,
    data,
  });
};

const getAllForms = (params) => {
  return axios({
    method: "get",
    url: Form.getAllForms,
    params,
  });
};

const createForm = (data) => {
  return axios({
    method: "post",
    url: Form.createForm,
    data,
  });
};

const deleteFormById = (formId) => {
  return axios({
    method: "delete",
    url: `${formUrl}/${formId}`,
  });
};

const updateFormById = ({ formId, data }) => {
  return axios({
    method: "put",
    url: `${formUrl}/${formId}`,
    data,
  });
};

export const checkResponseStatus = (formId) => {
  return axios({
    method: "get",
    url: `${Response.checkStatus}/${formId}`,
  });
};

export const getFormResponsesById = (formId) => {
  return axios({
    method: "get",
    url: `${responseUrl}/${formId}`,
  });
};

export {
  getFormById,
  sendResponse,
  getAllForms,
  createForm,
  deleteFormById,
  updateFormById,
};
