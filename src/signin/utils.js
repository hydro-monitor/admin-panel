import store from "store";
import jwt from "jsonwebtoken";

export const isLoggedIn = () => !!store.get("loggedIn");

export const isAdmin = () => !!store.get("admin");

export const getUser = () => store.get("user");

export const getToken = () =>
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTk5Njg0MjEwLCJ1c2VybmFtZSI6ImFpYmFyYmV0dGFAZmkudWJhLmFyIn0.KuC4GDFdehum2Np3d-wn2KZrkzb8r25-5QfVdR52Shw";

export const handleLogout = history => {
  store.remove("loggedIn");
  store.remove("user");
  store.remove("admin");
  store.remove("token");

  history.push("/signin");
};

export const tokenIsExpired = () => {
  var token = store.get("token");
  console.log("MA TOKEN", token);
  const { exp } = jwt.decode(token);
  console.log("MA EXP", exp);
  if (Date.now() >= exp * 1000) {
    console.log("THIS TOKEN IS EXPIRED!");
    return true;
  }
  return false;
};
