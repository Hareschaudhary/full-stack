import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    auth: {
        user:'nayanchaudhary539@gmail.com',
        // pass: '', 
    },
});

export default transporter;