const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
	// Configure the transporter. You may have credentials in .env
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST, // e.g. 'smtp.mailtrap.io'
		port: process.env.SMTP_PORT, // e.g. 587
		auth: {
			user: process.env.SMTP_USER, // e.g. 'someuser'
			pass: process.env.SMTP_PASS, // e.g. 'somepass'
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_FROM || 'no-reply@example.com',
		to,
		subject,
		html,
	};

	return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
