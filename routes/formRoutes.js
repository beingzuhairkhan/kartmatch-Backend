import express from 'express';
import { submitForm, getAllForms } from '../controllers/formController.js';
import { formValidationRules } from '../middlewares/formValidator.js';
// import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public form submission
router.post('/submit', formValidationRules, submitForm);

// Admin route to get all forms
router.get('/all', getAllForms);

export default router;
