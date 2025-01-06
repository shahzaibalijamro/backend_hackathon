import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'linnea.kutch@ethereal.email',
        pass: '3beBbs7c57MExYAau1'
    }
});

const sendWelcomeEmail = async (userEmail) => {
    const mailOptions = {
        from: 'linnea.kutch@ethereal.email',
        to: userEmail,
        subject: 'Welcome to Our App!',
        html: '<h1>Welcome!</h1><p>Thank you for registering with our app.</p>',
    };
    await transporter.sendMail(mailOptions);
};

export {sendWelcomeEmail}