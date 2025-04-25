import Form from '../model/supportSchema.js';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Set up the Nodemailer transporter with your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another email service if needed
  auth: {
    user: 'zuhairkhan5134@gmail.com',
    pass: 'apuc xqia tnfe buce'
  }
});

export const submitForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, emailId, message } = req.body;

  try {
    // Save form data to the database
    const form = new Form({
      firstName,
      lastName,
      emailId,
      mark: false, // Default value for mark
      message
    });

    await form.save();

    // Prepare the email content
    const mailOptions = {
      from: emailId,
      to: 'zuhairkhan5134@gmail.com',
      subject: 'New Support Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; background: linear-gradient(to right, #ff5722, #ff9800); padding: 6px 14px; border-radius: 20px; color: #fff; font-weight: bold; font-size: 14px;">
              Kart-Match Support
            </span>
          </div>

          <h2 style="color: #f44336; text-align: center; margin-bottom: 20px;">📬 Support Form Submission</h2>

          <div style="background: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <p style="font-size: 14px; color: #333;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="font-size: 14px; color: #333;"><strong>Email:</strong> ${emailId}</p>
            <p style="font-size: 14px; color: #333;"><strong>Message:</strong></p>
            <p style="font-size: 14px; color: #555; line-height: 1.6;">${message}</p>
          </div>

          <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
            <p>Kart-Match &copy; ${new Date().getFullYear()} </p>
          </footer>
        </div>
      `
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    // Respond to the client that the form was submitted and email sent
    res.status(201).json({
      message: 'Form submitted successfully and email sent',
      form
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
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
