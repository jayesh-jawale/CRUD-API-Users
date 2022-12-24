import userSchemaa from "./userSchema.js";
import jwt from "jsonwebtoken";
// Find email
const searchEmail = (email) => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .findOne({ email })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Find Number
const searchPhone = (phone) => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .findOne({ phone })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Create User
const createUser = (userObject) => {
  return new Promise((resolve, reject) => {
    userSchemaa(userObject)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Get users
const getUsers = () => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .find({})
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Get user by Id
const getUserById = (_id) => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .find({ _id })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Update User
const updateUserById = (_id, updateData) => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .findOneAndUpdate(
        { _id },
        {
          $set: updateData,
        }
      )
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Delete user
const deleteUser = (_id) => {
  return new Promise((resolve, reject) => {
    userSchemaa
      .findOneAndDelete({ _id })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

// Create Token
const createToken = async (_id) => {
  const accessJWT = jwt.sign({ _id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  await storeTokenInDB(_id, accessJWT);
  return Promise.resolve(accessJWT);
};

// Store Token
const storeTokenInDB = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      userSchemaa
        .findOneAndUpdate(
          { _id },
          {
            $set: { "authToken.token": token },
          }
        )
        .then((data) => resolve(data));
    } catch (error) {
      reject(error);
    }
  });
};

export {
  createUser,
  searchEmail,
  searchPhone,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
  createToken,
  storeTokenInDB,
};
