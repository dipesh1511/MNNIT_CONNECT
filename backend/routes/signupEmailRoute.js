import express from 'express';
import { signupEmail,sendFeedback } from '../controllers/signupEmailController.js'; 

const signupEmailRoute = express.Router();
// console.log("inside signup Email Route");
signupEmailRoute.post('/verification-code', signupEmail);


signupEmailRoute.post('/feedback', sendFeedback);
export default signupEmailRoute;
