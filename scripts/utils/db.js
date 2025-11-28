import {
  hashPassword,
  comparePassword
} from "./hashingPassword.js";

const users = JSON.parse(localStorage.getItem("users"));

class User {
  #users = users || [];

  getUsers() {
    return new Promise((resolve, reject) => {
      return resolve(this.#users);
    });
  }

  #findById(id) {
    return this.#users.find((user) => {
      return user.id === id
    });
  }

  #findByEmail(email) {
    return this
      .#users
      .find((user) => {
        return user
          .email
          .toLowerCase()
          .includes(email
            .toLowerCase());
      });
  }

  createUser({ name, email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const foundUser = this.#findByEmail(email);

        if (foundUser) {
          throw new Error("Email is already registered.");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password: hashedPassword
        };

        this.#users.push(newUser);

        localStorage.setItem("users", JSON.stringify(this.#users));

        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  loginUser({ email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const foundUser = this.#findByEmail(email);

        if (!foundUser) {
          throw new Error("Email is not yet registered.");
        }

        const matchedPassword = await comparePassword(password, foundUser.password);

        if (!matchedPassword) {
          throw new Error("Wrong credentials.");
        }

        return resolve(foundUser);
      } catch (error) {
        return reject(error);
      }
    });
  }

  updateUser(id, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const foundUser = this.findById(id);;
        if (!foundUser) {
          throw new Error("User not found.");
        }

        this.#users = this.#users.map((user) => {
          return user.id === foundUser.id ?
            {
              ...user,
              email: payload.email || user.email,
              name: payload.name || user.name,
              password: payload.password || user.password,
            } :
            user;
        });

        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  findUserById(id) {
    return new Promise((resolve, reject) => {
      try {
        const foundUser = this.#findById(id);

        if (!foundUser) {
          throw new Error("User not found.");
        }

        return resolve(foundUser);
      } catch (error) {
        return reject(error);
      }
    });
  }

  findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        const foundUser = this.#findByEmail(email);
        if (!foundUser) {
          throw new Error("User not found.");
        }

        return resolve(foundUser);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

const user = new User();

export { user };