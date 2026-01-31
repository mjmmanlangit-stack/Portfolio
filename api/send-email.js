const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from ${name}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #eeeeee;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">New Message Received</h2>
              <p style="margin: 6px 0 0; font-size: 13px; color: #666666;">From your portfolio contact form</p>
            </td>
          </tr>
          
          <!-- Sender Info -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Sender</p>
              <p style="margin: 0; font-size: 15px; font-weight: 500; color: #1a1a1a;">${name}</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #666666;">${email}</p>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message</p>
              <blockquote style="margin: 0; padding: 16px 0 16px 16px; border-left: 2px solid #007bff; font-size: 14px; line-height: 1.6; color: #333333; font-style: normal;">
                ${message.split('\n').map(line => line || '<br>').join('\n')}
              </blockquote>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="padding: 28px 32px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px; border: 1px solid #007bff; transition: all 0.2s ease;">Reply to Message</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #fafafa;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #999999; line-height: 1.5;">Received on ${timestamp}</p>
              <p style="margin: 0; font-size: 11px; color: #bbbbbb;">© 2025 Mark Jan Manlangit. This email was sent from your portfolio.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      html: emailTemplate,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}
