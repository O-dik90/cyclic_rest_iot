const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./mailTemplate");
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

const sendResetEmail = async (mailRecipient, urlReset) => {
  try {
    const res = await mailClient.sendMail({
      from: sender,
      to: mailRecipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", urlReset),
      category: "Password Reset",
    })
    console.log("email sent successfully", res)
  } catch (error) {
    console.error("error:", error);
    next(new createError(`${error}`, 400));
  }
}

const sendResetSuccessEmail = async (mailRecipient) => {
  try {
    const res = await mailClient.sendMail({
      from: sender,
      to: mailRecipient,
      subject: "Reset password successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    })
    console.log("email sent successfully", res)
  } catch (error) {
    console.error("error:", error);
    next(new createError(`${error}`, 400));
  }
}
module.exports = {
  sendVerifEmail,
  sendResetEmail,
  sendResetSuccessEmail
}