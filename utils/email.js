const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `Idea App <${process.env.SENDMAIL_EMAIL}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDMAIL_EMAIL,
          pass: process.env.SENDMAIL_PASSWORD
        }
      });
    }
  }

  // Send the actual email
  async send(subject, text, alreadyEmail) {
    // 2) Define email options
    let mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text
    };

    if (alreadyEmail) {
      console.log('Yes, already Mail');

      mailOptions = {
        from: this.from,
        to: alreadyEmail,
        subject,
        text
      };
    }

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Idea App!');
  }

  async inviteMemberinUniversity(university, userEmail) {
    await this.send(
      'Invitation',
      `You have been invited as a Member by ${university} on your App! Invitation Link: ${this.url}`,
      userEmail
    );
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
