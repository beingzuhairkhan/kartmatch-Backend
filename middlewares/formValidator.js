import { body } from 'express-validator';

export const formValidationRules = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('emailId')
  .notEmpty()
  .withMessage('Email is required')
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .withMessage('Invalid email address'),
  // body('mark').isBoolean().withMessage('Mark must be a boolean'),
  body('message').notEmpty().withMessage('Message is required'),
];
