import { body } from 'express-validator';

export const formValidationRules = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('emailId').isEmail().withMessage('Valid email is required'),
  body('mark').isBoolean().withMessage('Mark must be a boolean'),
  body('message').notEmpty().withMessage('Message is required'),
];
