import { verifyToken } from "../utils/token.js";
import { user } from "../utils/db.js";

const accessToken = sessionStorage.getItem("accessToken");

if (!accessToken) {
  window.location.href = "./signin.html";
}

verifyToken(accessToken)
  .then(({ success, payload }) => {
    if (!success) {
      window.location.href = "./signin.html";
    }

    user
      .findUserById(payload.id)
      .then((user) => {
        const h1 = document.querySelector("h1");

        return h1.textContent = `Welcome back, ${user.name}!`;
      })
  });