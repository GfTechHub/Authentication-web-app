import { validateForm } from "../utils/validateForm.js";
import { user } from "../utils/db.js";

const signUpForm = document.getElementById("sign-up-form");
const labels = signUpForm.querySelectorAll("label");
const errorEls = signUpForm.querySelectorAll("[data-input]");
const formStatusEl = signUpForm.querySelector(".form-status");

async function signUp(event) {
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

  signUpForm.classList.remove("error", "success");

  const { target } = event;
  try {
    const formData = new FormData(target);

    const validForm = validateForm(formData);

    if (!validForm.success) {
      return validForm.errors.forEach(error => {
        labels.forEach(label => {
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

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    await user.createUser({ name, email, password });

    signUpForm.classList.add("success");
    formStatusEl.textContent = "You have successfully created an account.";

  } catch (error) {
    signUpForm.classList.add("error");
    formStatusEl.textContent = error.message;
  }
};

signUpForm.addEventListener("submit", signUp);