import { axios } from "./index";
import { User } from "./config";

const loginUser = (data) => {
  return axios({ method: "post", url: User.login, data });
};

const registerUser = (data) => {
  return axios({
    method: "post",
    url: User.register,
    data,
  });
};

export { loginUser, registerUser };
