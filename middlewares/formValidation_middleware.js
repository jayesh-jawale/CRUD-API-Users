import Joi from "joi";

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

const fname = Joi.string().min(2).max(50).required();
const mname = Joi.string().min(1).max(50).optional();
const lname = Joi.string().min(2).max(50).required();
const dob = Joi.string().optional();
const phone = Joi.number().required();
const occupation = Joi.string().min(2).max(50).optional();
const company = Joi.string().min(2).max(50).optional();
const password = Joi.string().min(2).max(50).required();

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fname,
    mname,
    lname,
    dob,
    email,
    phone,
    occupation,
    company,
    password,
  });
  const data = schema.validate(req.body);

  if (data.error) {
    return res.json({ status: "error", message: data.error.message });
  }
  next();
};

export { newUserValidation };
