import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "services/User";
import { cookie } from "utils";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);

  let [isLoading, setIsLoading] = useState(true);

  let location = useLocation();

  let searchParams = new URLSearchParams(location.search);

  let redirectUrl = searchParams.get("url");

  let navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("unauthorized", logout);
    getUser();
    return () => document.removeEventListener("unauthorized", logout);
  }, []);

  const getUser = () => {
    let token = cookie.get("auth_token");
    if (token) {
      let decoded = jwtDecode(token);
      setUser(decoded);
    }
    if (isLoading) setIsLoading(false);
  };

  const login = async (data) => {
    try {
      let {
        data: { token },
      } = await loginUser(data);
      cookie.set({ name: "auth_token", days: 7, value: token });
      let decoded = jwtDecode(token);
      setUser(decoded);
      navigate(redirectUrl || "/form/list");
    } catch (error) {
      if (error?.message === "User not exist") {
        navigate(`/auth/register${redirectUrl ? `?url=${redirectUrl}` : ""}`);
      }
    }
  };

  const register = async (data) => {
    let {
      data: { token },
    } = await registerUser(data);
    cookie.set({ name: "auth_token", days: 7, value: token });
    let decoded = jwtDecode(token);
    setUser(decoded);
    navigate(redirectUrl || "/form/list");
  };

  const logout = () => {
    document.title = "Google Form";
    let root = document.querySelector("html");
    if (root) root.removeAttribute("style");
    cookie.remove("auth_token");
    setUser(null);
    navigate("/auth/login");
  };

  let context = { user, isLoading, setUser, login, register, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
