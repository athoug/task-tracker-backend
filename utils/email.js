const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY); // Set in .env

const sendEmail = async ({ to, subject, html }) => {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.EMAIL_FROM || "no-reply@itsmetasko.com",
			to,
			subject,
			html,
		});

		if (error) {
			console.error("Resend error:", error);
			throw new Error("Failed to send email");
		}

		return data;
	} catch (err) {
		console.error("Error in sendEmail:", err);
		throw err;
	}
};

module.exports = { sendEmail };
