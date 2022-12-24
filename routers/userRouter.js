import express from "express";
const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { newUserValidation } from "../middlewares/formValidation_middleware.js";
import {
  createUser,
  searchEmail,
  searchPhone,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
  createToken,
} from "../models/userModel.js";
import { hashedPassword, comparePassword } from "../helpers/bcrypt_helper.js";

router.all("/", (req, res, next) => {
  // res.send("Message from user Router");
  next();
});

// Create User
router.post("/create-user", newUserValidation, async (req, res) => {
  const {
    fname,
    mname,
    lname,
    dob,
    email,
    phone,
    occupation,
    company,
    password,
  } = req.body;

  try {
    const hashPassword = await hashedPassword(password);
    const bodyData = {
      fname,
      mname,
      lname,
      dob,
      email,
      phone,
      occupation,
      company,
      password: hashPassword,
    };

    // Check email already present
    const checkEmailPresent = await searchEmail(email);
    if (checkEmailPresent) {
      return res.status(401).send({ message: "Email already exists" });
    }

    // Check email already present
    const checkPhonePresent = await searchPhone(phone);
    if (checkPhonePresent) {
      return res.status(401).send({ message: "Phone already exists" });
    }

    // Ceck password strength, password pattern
    if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)
    ) {
      res.status(401).send({
        message: "Please enter 1 uppercase, 1 lowercase and aplhaNumeric",
      });
      return;
    }

    const result = await createUser(bodyData);
    res.json({ status: "success", message: "user created", result });
  } catch (error) {
    let message = "Unable to create user";
    res.json({ status: "error", message });
  }
});

// Get all users
// Also project users by providing Authentication
router.get("/get-users", authMiddleware, async (req, res) => {
  const data = await getUsers();

  if (data) {
    return res.json({
      status: "success",
      data,
    });
  }

  res.json({
    status: "error",
    message: "Cannot get users",
  });
});

// Get user by id
router.get("/get-users/:_id", authMiddleware, async (req, res) => {
  const { _id } = req.params;

  const data = await getUserById(_id);

  if (data) {
    return res.json({
      status: "success",
      data,
    });
  }

  res.json({
    status: "error",
    message: "Cannot get users",
  });
});

// Update user by Id
router.put("/:_id", authMiddleware, async (req, res) => {
  const { _id } = req.params;
  const updateData = req.body;

  const data = await updateUserById(_id, updateData);

  if (data) {
    return res.json({
      status: "success",
      message: "user is updated",
    });
  }

  res.json({
    status: "error",
    message: "Cannot update user",
  });
});

// Delete user
router.delete("/delete-user/:_id", async (req, res) => {
  const { _id } = req.params;

  const data = await deleteUser(_id);

  if (data) {
    return res.json({
      status: "success",
      data,
    });
  }

  res.json({
    status: "error",
    message: "Cannot delete users",
  });
});

//------------------------------------------------------------------------------------

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check for invalid email and password
  const userFromDb = await searchEmail(email);
  if (!userFromDb) {
    return res.status(401).send({ message: "Invalid Credentials" });
  }

  const storedPassword = userFromDb.password;

  // Compare actual password and entered password
  const result = await comparePassword(password, storedPassword);
  if (result) {
    // Create token
    const accessJWT = await createToken(userFromDb._id);

    res.json({ status: "success", message: "Login Successfull", accessJWT });
  } else {
    res.json({ status: "error", message: "Invalid Credentials" });
  }
});

export const userRouter = router;
