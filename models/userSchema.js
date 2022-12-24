import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: {
    type: String,
    maxlength: 50,
    required: true,
  },
  mname: {
    type: String,
    maxlength: 50,
    required: false,
  },
  lname: {
    type: String,
    maxlength: 50,
    required: true,
  },
  dob: {
    type: String,
    maxlength: 50,
    required: false,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 11,
    required: true,
  },
  occupation: {
    type: String,
    maxlength: 100,
    required: false,
  },
  company: {
    type: String,
    maxlength: 50,
    required: false,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  authToken: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
});

const userSchemaa = mongoose.model("Users", userSchema);
export default userSchemaa;
