import { SignupFormData } from "./typeDefinitions";

// @ts-ignore
const createUser = (userData) => {
  // @ts-ignore
  const user = fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(await res.json().then((resp) => resp.error));
      }
    })
    .catch((err) => {
      return {
        error: err,
      };
    });

  if (user) {
    return user;
  } else {
    return null;
  }
};

const getUserAssets = () => {
  const userAssets = fetch(
    `${process.env.NEXT_PUBLIC_WEBURL}/api/user/userAssets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(await res.json().then((resp) => resp.error));
      }
    })
    .catch((err) => {
      return {
        error: err,
      };
    });

  if (userAssets) {
    return userAssets;
  } else {
    return null;
  }
};

export { createUser, getUserAssets };
