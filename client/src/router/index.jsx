import { AuthProvider } from "hooks/useAuth";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Routes from "./Router";

import "assets/scss/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";

const Router = () => {
  return (
    <Fragment>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeButton
      />
    </Fragment>
  );
};

export default Router;
