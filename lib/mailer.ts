import nodemailer from 'nodemailer';

interface AlertEmailParams {
  ticketId: string;
  userName: string;
  userMobile: string;
  userEmail?: string | null;
  category: string;
  priority: string;
  title: string;
  description: string;
  createdAt: Date;
}

/**
 * Sends an email alert to the support/admin person when a new ticket is raised.
 * If credentials are not set, or sending fails, it catches the error and logs it.
 */
export async function sendSupportAlertEmail(params: AlertEmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const supportEmail = process.env.SUPPORT_ALERT_EMAIL;
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

  console.log(`[Mailer] Attempting email send for ticket ${params.ticketId}`);

  if (!host || !user || !pass || !supportEmail) {
    console.warn(
      `[Mailer Warning] SMTP environment variables are not fully configured. Email alerts are skipped. ` +
      `Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SUPPORT_ALERT_EMAIL in your .env file.`
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others
      auth: {
        user,
        pass,
      },
    });

    const ticketLink = `${dashboardUrl}/support-dashboard/tickets/${params.ticketId}`;
    
    const subject = `New Support Ticket Raised - ${params.ticketId}`;
    const textBody = `
A new support issue has been submitted.

Ticket ID: ${params.ticketId}
User Name: ${params.userName}
Mobile: ${params.userMobile}
Email: ${params.userEmail || 'N/A'}
Category: ${params.category}
Priority: ${params.priority}
Issue Title: ${params.title}

Description:
${params.description}

Submitted Date and Time: ${params.createdAt.toLocaleString()}

Please check this ticket in the dashboard:
${ticketLink}
    `.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background-color: #fff;">
        <h2 style="color: #0f766e; margin-top: 0; border-bottom: 2px solid #0f766e; padding-bottom: 8px;">New Support Ticket Raised</h2>
        <p style="font-size: 16px; font-weight: bold; color: #1e293b;">Ticket ID: ${params.ticketId}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0; width: 30%;">User Name</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${params.userName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Mobile</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${params.userMobile}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Email</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${params.userEmail || '<em style="color:#94a3b8">N/A</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Category</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="background-color:#ccfbf1; color:#0f766e; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${params.category}</span></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Priority</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">
              <span style="padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                ${params.priority === 'Critical' ? 'background-color:#fee2e2; color:#b91c1c;' : ''}
                ${params.priority === 'High' ? 'background-color:#ffedd5; color:#c2410c;' : ''}
                ${params.priority === 'Medium' ? 'background-color:#fef9c3; color:#a16207;' : ''}
                ${params.priority === 'Low' ? 'background-color:#f1f5f9; color:#475569;' : ''}
              ">${params.priority}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Issue Title</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 500;">${params.title}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Submitted At</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${params.createdAt.toLocaleString()}</td>
          </tr>
        </table>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0; font-weight: bold; font-size: 14px; color: #475569;">Description:</p>
          <p style="margin: 4px 0 0 0; white-space: pre-wrap; font-size: 14px; color: #1e293b;">${params.description}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${ticketLink}" style="background-color: #0f766e; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(15, 118, 110, 0.2);">
            View Ticket in Support Dashboard
          </a>
        </div>
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          This is an automated alert generated by your Next.js Support Ticket Module.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"PugArch FSM Support" <${user}>`,
      to: supportEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[Mailer] Email sent successfully for ticket ${params.ticketId}`);
    return true;
  } catch (error) {
    console.error(`[Mailer Error] Failed to send support email alert:`, error);
    return false;
  }
}
