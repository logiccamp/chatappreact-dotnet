export function getAuthToken() {
  return localStorage.getItem("billsauth_token");
}

export function setAuthToken(token) {
  localStorage.setItem("billsauth_token", token);
}

export function logout() {
  localStorage.removeItem("billsauth_token");
}
