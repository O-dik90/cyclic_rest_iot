const { VERIFICATION_EMAIL_TEMPLATE } = require("./mailTemplate");
const { mailClient, sender } = require("./mailtrap.config");

const sendVerifEmail = async (mailRecipient, verifToken) => {

  try {
    const res = await mailClient.sendMail({
      from: sender,
      to: mailRecipient,
      subject: "Account Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verifToken),
      category: "Email Verification",
    })
    console.log("email sent successfully", res)
  } catch (error) {
    console.error("error:", error);
    next(new createError(`${error}`, 400));
  }
}

module.exports = {
  sendVerifEmail
}