import { body, validationResult } from "express-validator";

const validationRegistration = [
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only letters'),

  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only letters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Must be a valid phone number'),

  body('address')
    .notEmpty().withMessage('Address is required')
];

export { validationRegistration,validationResult };
