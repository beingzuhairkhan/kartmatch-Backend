import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true 
  },
  lastName: {
    type: String,
    required: true 
  },
  emailId: {
    type: String,
    required: true 
  },
  mark:{
    type: Boolean,
    required: true 
  },
  message: {
    type: String,
    required: true 
  }
});

const Form = mongoose.model('Form', formSchema);

export default Form;
