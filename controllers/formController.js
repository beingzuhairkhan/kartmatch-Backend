import Form from '../model/supportSchema.js';
import { validationResult } from 'express-validator';

// POST - User submits form (no 'mark' allowed)
export const submitForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, emailId, message } = req.body;

  try {
    const form = new Form({
      firstName,
      lastName,
      emailId,
      mark: false, // default false
      message
    });

    await form.save();
    res.status(201).json({ message: 'Form submitted successfully', form });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET - Admin fetch all submitted forms
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// PATCH - Admin marks a form as read (mark = true)
export const markFormAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.mark = true;
    await form.save();

    res.status(200).json({ message: 'Form marked as read', form });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
