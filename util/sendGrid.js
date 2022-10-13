import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_Grid);
const SEND_FROM = process.env.SEND_EMAIL_FROM;

export const EmailService = (data, content, subject) => {
  const msg = {
    to: data.email, // Change to your recipient
    from: SEND_FROM, // Change to your verified sender
    subject: subject,
    // text: 'and easy to do anywhere, even with Node.js',
    html: content,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
