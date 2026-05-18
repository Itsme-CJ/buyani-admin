import * as Yup from 'yup';

export const REQUIRED_FIELD = 'This field is Required.';
const PASSWORD_FIELD = 'Password must be at least 8 charaters';

export const loginSchema = Yup.object({
  email        : Yup.string()
                    .email()
                    .required(REQUIRED_FIELD),
  password        : Yup.string()
                      .required(REQUIRED_FIELD),
});

export const pinSchema = Yup.object({
  pin        : Yup.string()
                    .required('Invalid Admin PIN. Please try again'),
});

export const forgotPasswordSchema = Yup.object({
  email        : Yup.string()
                      .email()
                      .required(REQUIRED_FIELD),
});

export const activateAccountSchema = Yup.object({
  studentNumber   : Yup.string()
                      .required(REQUIRED_FIELD),
  email           : Yup.string()
                      .email()
                      .required(REQUIRED_FIELD),
});

export const createPasswordSchema = Yup.object({
  password     : Yup.string()
                      .min(8, PASSWORD_FIELD)
                      .required(REQUIRED_FIELD)
                      .matches(/\d/, 'Password must contain at least 1 number')
                      .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
                      .matches(/^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, 'Password must contain at least 1 special character'),
  confirmPassword : Yup.string()
                        .required(REQUIRED_FIELD)
                       .oneOf([Yup.ref('password')], 'New and confirm password must match'),
});

export const settingsSchema = Yup.object({
  name: Yup.string()
                      .required(REQUIRED_FIELD),
  postalCode: Yup.string()
        .required(REQUIRED_FIELD),
  state: Yup.string()
        .required(REQUIRED_FIELD),
  city: Yup.string()
        .required(REQUIRED_FIELD),
});

export const storeSchema = Yup.object({
  name: Yup.string()
                      .required(REQUIRED_FIELD),
  postalCode: Yup.string()
        .required(REQUIRED_FIELD),
  state: Yup.string()
        .required(REQUIRED_FIELD),
  city: Yup.string()
        .required(REQUIRED_FIELD)
});

export const profileSchema = Yup.object({
  studentNumber: Yup.string()
                      .required(REQUIRED_FIELD),
  firstName: Yup.string()
                      .required(REQUIRED_FIELD),
  lastName: Yup.string()
                      .required(REQUIRED_FIELD),
  email: Yup.string()
                      .email()
                      .required(REQUIRED_FIELD),
  quotes: Yup.string()
                      .required(REQUIRED_FIELD),
});

export const categorySchema = Yup.object({
  name: Yup.string()
                      .required(REQUIRED_FIELD),
  description: Yup.string()
                      .required(REQUIRED_FIELD),
});

export const productItemSchema = Yup.object({
  productNumber: Yup.string()
                      .matches(/^[a-zA-Z0-9 ]*$/, "No special characters or periods allowed")
                      .required(REQUIRED_FIELD),
  name: Yup.string()
                      .required(REQUIRED_FIELD),
                      genericName: Yup.string()
                      .required(REQUIRED_FIELD),
  price: Yup.number().integer('Please enter a valid number')
                      .required(REQUIRED_FIELD),
  stock: Yup.number().integer('Please enter a valid number')
                      .required(REQUIRED_FIELD),
                      criticalLevel: Yup.number().integer('Please enter a valid number')
                      .required(REQUIRED_FIELD),
  description: Yup.string()
                      .required(REQUIRED_FIELD),
});

export const userSchema = Yup.object({
  firstName: Yup.string()
                      .required(REQUIRED_FIELD),
  lastName: Yup.string()
                      .required(REQUIRED_FIELD),
  email: Yup.string()
                      .required(REQUIRED_FIELD),
});

export const personnelSchema = Yup.object({
  fullName: Yup.string()
                      .required(REQUIRED_FIELD),
  prefix: Yup.string()
                      .required(REQUIRED_FIELD),
  department: Yup.string()
                      .required(REQUIRED_FIELD),
  position: Yup.string()
                      .required(REQUIRED_FIELD)
});

export const programSchema = Yup.object({
  name: Yup.string()
                      .required(REQUIRED_FIELD)
});