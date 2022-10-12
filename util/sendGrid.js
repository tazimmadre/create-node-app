import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
const key = process.env.SEND_Grid;

export const EmailService = (data, content, subject) => {
  const msg = {
    to: data.email, // Change to your recipient
    from: "hello@potionsofparadise.com", // Change to your verified sender
    subject: subject,
    // text: 'and easy to do anywhere, even with Node.js',
    html: content,
    dynamic_template_data: {
      firstName: data.firstName,
      lastName: data.lastName,
      templateId: "d-51c529e434034435b068fb6074f11374",
      email: "hello@potionsofparadise.com",
      application: "www.potionofparadise.com",
    },
  };

  sgMail.setApiKey(process.env.SEND_Grid);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
