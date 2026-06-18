import nodemailer from "nodemailer";

// Create the email transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const baseUrl = `https://${(process.env.NEXTAUTH_URL ?? "localhost:3000").replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

function emailStyles() {
  return `
    <style>
      body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 24px; }
      .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .body { background: #ffffff; padding: 32px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
      .button { display: inline-block; background-color: #2563eb; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
      .footer { margin-top: 24px; font-size: 13px; color: #94a3b8; text-align: center; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    </style>
  `;
}

export async function sendWelcomeEmail(email: string, password: string) {
  try {
    const info = await transporter.sendMail({
      from: `"G-Stack Portal" <${process.env.GMAIL_USER}>`, 
      to: email,
      subject: "Welcome to G-Stack Portal",
      html: `
        <html>${emailStyles()}
        <body>
          <div class="container">
            <div class="header"><h1>Welcome to G-Stack Portal</h1></div>
            <div class="body">
              <p>Your account has been created. Please use the following details to log in:</p>
              <ul>
                <li><strong>Username:</strong> ${email}</li>
                <li><strong>Temporary Password:</strong> <code>${password}</code></li>
              </ul>
              <a href="${baseUrl}/login" class="button">Go to Login</a>
              <p><em>Please update your password immediately after your first login.</em></p>
              <hr>
              <p>Best regards,<br>George Morgan<br>G-Stack Team</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} G-Stack Digital Agency</div>
          </div>
        </body></html>
      `,
    });

    console.log("✅ Welcome Email sent successfully:", info.messageId);
    return { success: true };

  } catch (err) {
    console.error("❌ Error sending Welcome Email:", err);
    return { success: false, error: err };
  }
}

export async function sendResetEmail(email: string, resetToken: string) {
  const resetUrl = `${baseUrl}/login/reset?token=${resetToken}`;
  
  try {
    const info = await transporter.sendMail({
      from: `"G-Stack Portal" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Action Required: Reset Your G-Stack Portal Password",
      html: `
        <html>${emailStyles()}
        <body>
          <div class="container">
            <div class="header"><h1>Reset Your Password</h1></div>
            <div class="body">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to continue:</p>
              <a href="${resetUrl}" class="button" style="background-color: #dc2626;">Reset My Password</a>
              <p><strong>Note:</strong> This link expires in 1 hour.</p>
              <p>If you did not request this, please ignore this email.</p>
              <hr>
              <p>Best regards,<br>G-Stack Team</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} G-Stack Digital Agency</div>
          </div>
        </body></html>
      `,
    });

    console.log("✅ Reset Email sent successfully:", info.messageId);
    return { success: true };

  } catch (err) {
    console.error("❌ Error sending Reset Email:", err);
    return { success: false, error: err };
  }
}

export async function sendStatusChangeEmail(
  clientEmail: string,
  clientName: string,
  projectTitle: string,
  oldStatus: string,
  newStatus: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"G-Stack Portal" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `Project Status Updated: ${projectTitle}`,
      html: `
        <html>${emailStyles()}
        <body>
          <div class="container">
            <div class="header"><h1>Project Status Updated</h1></div>
            <div class="body">
              <p>Hello ${clientName},</p>
              <p>The status of your project <strong>"${projectTitle}"</strong> has been updated.</p>
              <p style="text-align: center; font-size: 18px; padding: 16px; background: #f8fafc; border-radius: 8px; margin: 16px 0;">
                <span style="color: #94a3b8;">${oldStatus}</span>
                <span style="margin: 0 12px; color: #2563eb;">→</span>
                <span style="font-weight: 700; color: #2563eb;">${newStatus}</span>
              </p>
              <a href="${baseUrl}/dashboard/projects" class="button">View Your Projects</a>
              <hr>
              <p>Best regards,<br>G-Stack Team</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} G-Stack Digital Agency</div>
          </div>
        </body></html>
      `,
    });

    console.log("✅ Status Change Email sent successfully:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Error sending Status Change Email:", err);
    return { success: false, error: err };
  }
}

export async function sendFileUploadEmail(
  clientEmail: string,
  clientName: string,
  projectTitle: string,
  fileName: string,
  uploaderName: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"G-Stack Portal" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `New File Uploaded: ${fileName}`,
      html: `
        <html>${emailStyles()}
        <body>
          <div class="container">
            <div class="header"><h1>New File Uploaded</h1></div>
            <div class="body">
              <p>Hello ${clientName},</p>
              <p>A new file has been uploaded to your project <strong>"${projectTitle}"</strong>:</p>
              <p style="text-align: center; font-size: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; margin: 16px 0;">
                📄 <strong>${fileName}</strong><br>
                <span style="font-size: 13px; color: #64748b;">Uploaded by: ${uploaderName}</span>
              </p>
              <a href="${baseUrl}/dashboard/files" class="button">View Files</a>
              <hr>
              <p>Best regards,<br>G-Stack Team</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} G-Stack Digital Agency</div>
          </div>
        </body></html>
      `,
    });

    console.log("✅ File Upload Email sent successfully:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Error sending File Upload Email:", err);
    return { success: false, error: err };
  }
}

export async function sendInvoiceCreatedEmail(
  clientEmail: string,
  clientName: string,
  invoiceTitle: string,
  amount: number,
  dueDate: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"G-Stack Portal" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `New Invoice: ${invoiceTitle}`,
      html: `
        <html>${emailStyles()}
        <body>
          <div class="container">
            <div class="header"><h1>New Invoice</h1></div>
            <div class="body">
              <p>Hello ${clientName},</p>
              <p>A new invoice has been created:</p>
              <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 16px 0;">
                <p style="font-size: 13px; color: #64748b; margin: 0;">${invoiceTitle}</p>
                <p style="font-size: 28px; font-weight: 700; color: #2563eb; margin: 8px 0;">$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style="font-size: 13px; color: #64748b; margin: 0;">Due: ${dueDate}</p>
              </div>
              <a href="${baseUrl}/dashboard/invoices" class="button">View Invoices</a>
              <hr>
              <p>Best regards,<br>G-Stack Team</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} G-Stack Digital Agency</div>
          </div>
        </body></html>
      `,
    });

    console.log("✅ Invoice Email sent successfully:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Error sending Invoice Email:", err);
    return { success: false, error: err };
  }
}