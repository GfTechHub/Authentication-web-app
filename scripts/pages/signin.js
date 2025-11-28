import { validateForm } from "../utils/validateForm.js";
import { user } from "../utils/db.js";
import { signToken } from "../utils/token.js";

const signInForm = document.getElementById("sign-in-form");
const labels = signInForm.querySelectorAll("label");
const errorEls = signInForm.querySelectorAll("[data-input]");
const formStatusEl = signInForm.querySelector(".form-status");

async function signIn(event) {
  event.preventDefault();

  labels.forEach(label => {
    if (label.classList.contains("error")) {
      label.classList.remove("error");
    }
  });

  errorEls.forEach(p => {
    if (p.textContent) {
      p.textContent = "";
      p.hidden = true;
    }
  });

  const { target } = event;
  try {
    const formData = new FormData(target);

    const validForm = validateForm(formData);

    if (!validForm.success) {
      return validForm.errors.forEach((error) => {
        labels.forEach((label) => {
          if (label.getAttribute("for").includes(error.key)) {
            label.classList.add("error");
          }
        });

        errorEls.forEach(p => {
          const { input } = p.dataset;

          if (input === error.key) {
            p.hidden = false;
            p.textContent = error.message;
          }
        });
      });
    }

    const email = formData.get("email");
    const password = formData.get("password");

    const foundUser = await user.loginUser({ email, password });
    const accessToken = await signToken(foundUser.id);

    sessionStorage.setItem("accessToken", accessToken);

    return window.location.href = "./index.html";
  } catch (error) {
    signInForm.classList.add("error");
    formStatusEl.textContent = `${error.message}`;
  }
};

signInForm.addEventListener("submit", signIn);