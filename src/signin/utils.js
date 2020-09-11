import store from "store";
import jwt from "jsonwebtoken";

export const isLoggedIn = () => !!store.get("loggedIn");

export const isAdmin = () => !!store.get("admin");

export const getUser = () => store.get("user");

export const getToken = () => store.get("token");

export const handleLogout = history => {
  store.remove("loggedIn");
  store.remove("user");
  store.remove("admin");
  store.remove("token");

  history.push("/signin");
};

export const tokenIsExpired = () => {
  var token = getToken();
  const { exp } = jwt.decode(token);
  if (Date.now() >= exp * 1000) {
    console.log("THIS TOKEN IS EXPIRED!");
    return true;
  }
  return false;
};
