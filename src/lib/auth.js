export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isLoggedIn() {
  return !!getUser();
}