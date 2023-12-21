import { Template } from "./config";
import { axios } from "./index";

const getAllTemplates = (params) => {
  return axios({
    method: "get",
    url: Template.getAllTemplate,
    params,
  });
};

export { getAllTemplates };
