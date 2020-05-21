const nodemailer = require('nodemailer');
const emailTemplate = require('./emailTemplate');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `Idea App <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_APIKEY
        }
      });
    }
  }

  // Send the actual email
  async send(subject, text) {
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: emailTemplate(text)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(verifyUrl) {
    await this.send(
      'welcome',
      `Welcome to the Idea App! Please verify you account here: ${verifyUrl}`
    );
  }

  async inviteMemberinUniversity(university) {
    await this.send(
      'Invitation',
      `You have been invited as a Member by ${university} on your App! Invitation Link: ${this.url}`
    );
  }

  async sendEmailToUser(message) {
    await this.send('Proposal Message', message);
  }

  async sendThanksToFundiser(name) {
    await this.send(
      'Great Thanks!',
      `Hello I am ${name} and want to give you a big Thanks You! to be part of our Idea and to fund it. We can never forgot your Support into this and giving you a great wishes :D`
    );
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
