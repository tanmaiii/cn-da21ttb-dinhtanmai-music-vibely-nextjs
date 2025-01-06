import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "jobquestofficial@gmail.com", pass: "pzln qyku rnvm gepr" },
});

export async function sendForgotPasswordEmail(email: string, token: string) {
  console.log(process.env.MAIL_NAME, process.env.MAIL_PASSWORD);

  const subject = "Reset password";
  const resetPasswordUrl = `${process.env.URL_FRONTEND}/reset-password?token=${token}`;
  const html = `
      <p>Click <a href="${resetPasswordUrl}">here</a> to reset your password</p>
    `;

  const msg = { from: process.env.MAIL_NAME, to: email, subject, html };

  try {
    await transport.sendMail(msg);
    return true;
  } catch (error) {
    console.error("❌✉️ Mail Error:", error);
    return false;
  }
}

export default { sendForgotPasswordEmail };
