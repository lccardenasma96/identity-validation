const TOKEN_KEY = "mubis_auth";

export const authService = {
  saveApproved() {
    localStorage.setItem(TOKEN_KEY, "approved");
  },

  isApproved() {
    return localStorage.getItem(TOKEN_KEY) === "approved";
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
