
import axios from "axios";

const API_URL = "http://localhost:3000";

// =====================================
// REGISTER USER
// =====================================

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/users`,
    userData
  );

  return response.data;
};

// =====================================
// GET USER BY EMAIL
// =====================================

export const getUserByEmail = async (email) => {
  const response = await axios.get(
    `${API_URL}/users`,
    {
      params: {
        email: email,
      },
    }
  );

  return response.data[0];
};

// =====================================
// GET USER BY ID
// =====================================

export const getUserById = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`
  );

  return response.data;
};

// =====================================
// LOGIN USER
// =====================================

export const loginUser = async ({
  email,
  password,
}) => {
  // Get user
  const user = await getUserByEmail(email);

  // User not found
  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // Wrong password
  if (user.password !== password) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // =====================================
  // CHECK BLOCK STATUS
  // =====================================

  if (
    user.isBlocked === true ||
    user.isBlocked === "true"
  ) {
    throw new Error(
      "Your account has been blocked by the administrator. You cannot login."
    );
  }

  // Login success
  return user;
};

// =====================================
// UPDATE USER
// =====================================

export const updateUser = async (
  id,
  data
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}`,
    data
  );

  return response.data;
};

// =====================================
// UPDATE USER PHONE + ADDRESS
// =====================================

export const updateUserAddress = async (
  id,
  phone,
  address
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}`,
    {
      phone,
      address,
    }
  );

  return response.data;
};

// =====================================
// CHECK WHETHER USER IS BLOCKED
// =====================================

export const checkUserBlocked = async (id) => {
  const user = await getUserById(id);

  return (
    user.isBlocked === true ||
    user.isBlocked === "true"
  );
};

 