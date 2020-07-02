import store from "store";

export const isLoggedIn = () => !!store.get("loggedIn");

export const isAdmin = () => !!store.get("admin");
