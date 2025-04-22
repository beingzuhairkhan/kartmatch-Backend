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
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  }
  
  mark:{
    type: Boolean,
   // required: true 
  },
  message: {
    type: String,
    required: true 
  }
});

const Form = mongoose.model('Form', formSchema);

export default Form;
