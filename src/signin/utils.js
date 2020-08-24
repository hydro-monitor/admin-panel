import store from "store";

export const isLoggedIn = () => !!store.get("loggedIn");

export const isAdmin = () => !!store.get("admin");

export const getUser = () => store.get("user");

export const handleLogout = history => {
  store.remove("loggedIn");
  store.remove("user");
  store.remove("admin");
  store.remove("token");

  history.push("/signin");
};
