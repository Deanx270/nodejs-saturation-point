const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8ef7ae0cad5f0c",
    pass: "8ea12f1f16ad5b"
  }
});

const getStatusMessage = (status) => {
  let color = '#1B263B';
  if (status === 'delivered') color = '#166534';
  if (status === 'cancelled') color = '#991b1b';

  const statusEmphasis = `<strong style="color: ${color}; font-size: 18px; letter-spacing: 0.5px; text-transform: uppercase;">${status}</strong>`;

  if (status === 'shipped') return `Your order has been ${statusEmphasis} and is on its way.`;
  if (status === 'delivered') return `Your order has been successfully ${statusEmphasis}.`;
  if (status === 'cancelled') return `Your order has been ${statusEmphasis}.`;
  return `Your order is now ${statusEmphasis}.`;
};

exports.sendReceiptEmail = async (customerEmail, customerName, status, orderId, pdfBuffer) => {
  const message = getStatusMessage(status);

  const mailOptions = {
    from: '"The Saturation Point" <no-reply@thesaturationpoint.com>',
    to: customerEmail,
    subject: `Update on your Order #${orderId.substring(0, 8)}`,
    html: `
      <div style="background-color: #FAF9F6; padding: 40px; font-family: 'Inter', Helvetica, sans-serif; color: #2D3436;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-top: 4px solid #D4AF37; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); padding: 40px;">
          <h2 style="font-family: 'Times New Roman', serif; color: #1B263B; font-size: 28px; font-weight: normal; margin-top: 0; text-align: center; letter-spacing: 1px;">THE SATURATION POINT</h2>
          
          <hr style="border: none; border-bottom: 1px solid #E2E8F0; margin: 30px 0;">
          
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName},</p>
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          ${status === 'delivered' ? '<p style="font-size: 16px; line-height: 1.6;">Your official order documentation is attached to this email for your records.</p>' : ''}
          
          <div style="margin: 40px 0; text-align: center;">
            <a href="http://localhost:3000" style="display: inline-block; background-color: #1B263B; color: #FFFFFF; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-size: 14px; letter-spacing: 1px;">VISIT STORE</a>
          </div>
          
          <hr style="border: none; border-bottom: 1px solid #E2E8F0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #636E72; text-align: center; margin-bottom: 5px;">Thank you for choosing The Saturation Point.</p>
          <p style="font-size: 12px; color: #a8a29e; text-align: center; margin-top: 0;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
    attachments: status === 'delivered' && pdfBuffer ? [
      {
        filename: `Receipt-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ] : []
  };

  return transporter.sendMail(mailOptions);
};
