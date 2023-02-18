import { SignupFormData } from "./typeDefinitions";

// @ts-ignore
const createUser = (userData) => {
  // @ts-ignore
  const user = fetch(`http://localhost:3000/api/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .catch((err) => {
      return null;
    });

  if (user) {
    return user;
  } else {
    return null;
  }
};

export { createUser };
