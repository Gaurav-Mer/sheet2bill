import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendInvoiceEmailOptions {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: string;
  invoiceUrl: string;
  fromName: string;
  dueDate?: string;
}

export async function sendInvoiceEmail({
  to,
  clientName,
  invoiceNumber,
  amount,
  invoiceUrl,
  fromName,
  dueDate,
}: SendInvoiceEmailOptions) {
  const dueDateLine = dueDate
    ? `<p style="margin:0 0 8px 0;color:#374151;">Payment due: <strong>${dueDate}</strong></p>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Sheet2Bill</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0;color:#111827;font-size:16px;">Hi ${clientName},</p>
              <p style="margin:0 0 24px 0;color:#374151;line-height:1.6;">
                ${fromName} has sent you an invoice. Please find the details below.
              </p>
              <!-- Invoice Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px 0;color:#374151;">Invoice number: <strong>${invoiceNumber}</strong></p>
                    <p style="margin:0 0 8px 0;color:#374151;">Amount due: <strong>${amount}</strong></p>
                    ${dueDateLine}
                  </td>
                </tr>
              </table>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#111827;border-radius:6px;">
                    <a href="${invoiceUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">
                      View Invoice
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;">
                Or copy this link: <a href="${invoiceUrl}" style="color:#111827;">${invoiceUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Sent via <a href="https://sheet2bill.in" style="color:#6b7280;">Sheet2Bill</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${clientName},\n\n${fromName} has sent you invoice ${invoiceNumber} for ${amount}.\n\nView it here: ${invoiceUrl}\n\nSent via Sheet2Bill`;

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Invoice ${invoiceNumber} from ${fromName}`,
    html,
    text,
  });
}

interface SendOverdueReminderOptions {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: string;
  invoiceUrl: string;
  fromName: string;
  dueDate: string;
  daysOverdue: number; // 0 = due today, 7 = 7 days late, 14 = 14 days late
}

export async function sendOverdueReminderEmail({
  to,
  clientName,
  invoiceNumber,
  amount,
  invoiceUrl,
  fromName,
  dueDate,
  daysOverdue,
}: SendOverdueReminderOptions) {
  const isToday = daysOverdue === 0;
  const subject = isToday
    ? `Payment Due Today — Invoice ${invoiceNumber}`
    : `Overdue: Invoice ${invoiceNumber} is ${daysOverdue} days past due`;

  const headerBg = isToday ? '#d97706' : '#dc2626';
  const urgencyLine = isToday
    ? `<p style="margin:0 0 8px 0;color:#92400e;background:#fef3c7;padding:10px 14px;border-radius:6px;font-size:14px;">⏰ Payment is due <strong>today</strong>.</p>`
    : `<p style="margin:0 0 8px 0;color:#991b1b;background:#fee2e2;padding:10px 14px;border-radius:6px;font-size:14px;">⚠️ This invoice is <strong>${daysOverdue} days overdue</strong>. Please arrange payment at your earliest convenience.</p>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:${headerBg};padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Sheet2Bill</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0;color:#111827;font-size:16px;">Hi ${clientName},</p>
              ${urgencyLine}
              <p style="margin:16px 0 24px 0;color:#374151;line-height:1.6;">
                This is a friendly reminder from <strong>${fromName}</strong> regarding the following invoice.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px 0;color:#374151;">Invoice number: <strong>${invoiceNumber}</strong></p>
                    <p style="margin:0 0 8px 0;color:#374151;">Amount due: <strong>${amount}</strong></p>
                    <p style="margin:0;color:#374151;">Due date: <strong>${dueDate}</strong></p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#111827;border-radius:6px;">
                    <a href="${invoiceUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">
                      View Invoice & Pay
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;">
                Or copy this link: <a href="${invoiceUrl}" style="color:#111827;">${invoiceUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Sent via <a href="https://sheet2bill.in" style="color:#6b7280;">Sheet2Bill</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${clientName},\n\nThis is a reminder from ${fromName}.\n\nInvoice: ${invoiceNumber}\nAmount due: ${amount}\nDue date: ${dueDate}\n${daysOverdue > 0 ? `This invoice is ${daysOverdue} days overdue.\n` : 'Payment is due today.\n'}\nView and pay: ${invoiceUrl}\n\nSent via Sheet2Bill`;

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
