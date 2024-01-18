import nodemailer from "nodemailer";

class NodeMailer {
  sendMail(email: string, text: string): Promise<{ mailSent: true }> {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.RESET_PASS_SEND_EMAIL,
          pass: process.env.RESET_PASS_SEND_PASS,
        },
      });

      const mailOptions = {
        from: `"SocialAuth"<${process.env.RESET_PASS_SEND_EMAIL}>`,
        to: email,
        subject: "SocialAuth Account Password Reset",
        text: text,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve({
            mailSent: true,
          });
        }
      });
    });
  }
}

export default new NodeMailer();
