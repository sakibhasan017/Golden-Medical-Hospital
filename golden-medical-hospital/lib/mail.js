// lib/mail.js
import nodemailer from 'nodemailer';

const portNum = Number(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: portNum,
  secure: portNum === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log('[mail] SMTP transporter verified');
    return true;
  } catch (err) {
    console.error('[mail] transporter.verify() failed:', err && err.message ? err.message : err);
    throw err;
  }
}

export async function sendConfirmMail({ to, patientName, doctorName, date, time }) {
  const dateStr = date ? new Date(date).toLocaleDateString() : '—';
  const timeStr = time ?? '—';

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Appointment confirmed with ${doctorName}`,
      html: `
        <p>Hi ${patientName},</p>
        <p>Your appointment has been <strong>confirmed</strong> with <strong>${doctorName}</strong>.</p>
        <p><strong>Date:</strong> ${dateStr} <br/><strong>Time:</strong> ${timeStr}</p>
        <p>Thank you,<br/>Golden Medical</p>
      `,
    });

    console.log('[mail] sendMail result:', {
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    });

    return {
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error('[mail] sendMail error:', err && err.message ? err.message : err);
    
    throw err;
  }
}

export default transporter;
