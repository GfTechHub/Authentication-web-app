const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

function validateForm(formData) {
  const errors = [];

  let password = null;

  formData.forEach((value, key) => {
    if (!value) {
      const keyName = key
        .charAt(0)
        .toUpperCase() +
        key
        .slice(1)
        .split(/(?=[A-Z])/)
        .join(" ")
        .toLowerCase();

      return errors.push({
        key,
        message: `${keyName} is required.`
      });
    }

    switch (key) {
      case "name":
        break;
      case "email":
        const validEmail = emailRegex.test(value);

        if (!validEmail) {
          return errors.push({
            key,
            message: "Invalid email format."
          });
        }
        break;
      case "password":
        if (value < 8) {
          return errors.push({
            key,
            message: "Password must have atleast 8 characters."
          });
        }

        const validPassword = passwordRegex.test(value);

        if (!validPassword) {
          return errors.push({
            key,
            message: "Password must have atleast 1 uppercase, lowercase, a special character and a number."
          });
        }

        if (!password) {
          password = value;
        }
        break;
      case "confirmPassword":
        if (!password) {
          return errors.push({
            key: "confirmPassword",
            message: "Password is required."
          });
        }

        const matchedPassword = password === value;

        if (!matchedPassword) {
          return errors.push({
            key,
            message: "Confirm password and password must matched."
          });
        }

        break;
    }
  });

  if (errors.length <= 0) {
    return { success: true };
  }

  return { success: false, errors };
}

export { validateForm };