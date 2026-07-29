const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email to user
const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Lifemed Pharma" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email — Lifemed Pharma',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f8fafc;padding:0;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a4fa8,#2d7a4f);padding:32px 40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:1px;">💊 LIFEMED PHARMA</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Better Health. Better Life.</p>
        </div>
        <div style="padding:40px;background:#fff;">
          <h2 style="color:#1e293b;margin-top:0;">Hello, ${name}! 👋</h2>
          <p style="color:#64748b;line-height:1.7;">Thank you for registering with Lifemed Pharma. Please verify your email address to activate your account and start shopping.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="background:linear-gradient(135deg,#1a4fa8,#2d7a4f);color:#fff;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
              ✅ Verify My Email
            </a>
          </div>
          <p style="color:#94a3b8;font-size:13px;">This link expires in <strong>24 hours</strong>. If you did not register, please ignore this email.</p>
          <p style="color:#94a3b8;font-size:12px;word-break:break-all;">Or copy this link: ${verifyUrl}</p>
        </div>
        <div style="background:#f1f5f9;padding:20px 40px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">📍 182-D Khayban-e-Ameen, Lahore, Pakistan &nbsp;|&nbsp; 📞 +92 320 5342942</p>
        </div>
      </div>
    `
  });
};

// Send order notification to admin
// ✅ Fixed: uses order.customer.name and order.customer.address/city
const sendOrderNotification = async (order) => {
  const itemsList = order.items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">PKR ${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`
  ).join('');

  const paymentLabel = {
    cod:       '💵 Cash on Delivery',
    card:      '💳 Credit/Debit Card',
    easypaisa: '📱 EasyPaisa',
    jazzcash:  '📱 JazzCash',
    online:    '💳 Online Payment',
    cash:      '💵 Cash',
  }[order.paymentMethod] || order.paymentMethod;

  await transporter.sendMail({
    from: `"Lifemed Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🛒 New Order #${order.orderNumber} — PKR ${order.total.toLocaleString()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1a4fa8,#2d7a4f);padding:24px 32px;border-radius:12px 12px 0 0;">
          <h2 style="color:#fff;margin:0;">🛒 New Order Received!</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Order #${order.orderNumber}</p>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #e2e8f0;">
          <h3 style="color:#1e293b;margin-top:0;">Customer Details</h3>
          <table style="width:100%;font-size:14px;color:#475569;">
            <tr><td style="padding:6px 0;width:140px;"><strong>Name:</strong></td><td>${order.customer.name}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${order.customer.email}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Phone:</strong></td><td>${order.customer.phone}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Address:</strong></td><td>${order.customer.address}, ${order.customer.city}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Payment:</strong></td><td>${paymentLabel}</td></tr>
          </table>
          <h3 style="color:#1e293b;margin-top:24px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;color:#64748b;">Product</th>
              <th style="padding:8px 12px;text-align:center;color:#64748b;">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#64748b;">Price</th>
            </tr></thead>
            <tbody>${itemsList}</tbody>
          </table>
          <table style="width:100%;font-size:14px;margin-top:16px;color:#475569;">
            <tr><td>Subtotal:</td><td style="text-align:right;">PKR ${order.subtotal.toLocaleString()}</td></tr>
            <tr><td>Shipping:</td><td style="text-align:right;">PKR ${order.shippingCost.toLocaleString()}</td></tr>
            <tr style="font-size:18px;font-weight:700;color:#1a4fa8;">
              <td>TOTAL:</td><td style="text-align:right;">PKR ${order.total.toLocaleString()}</td>
            </tr>
          </table>
          ${order.notes ? `<p style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;font-size:13px;color:#64748b;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        <div style="background:#f8fafc;padding:16px 32px;border-radius:0 0 12px 12px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">Lifemed Pharma — info@lifemedpharma.com — +92 320 5342942</p>
        </div>
      </div>
    `
  });
};

// Send order confirmation to customer
// ✅ Fixed: uses order.customer.name instead of firstName
const sendOrderConfirmation = async (order) => {
  await transporter.sendMail({
    from: `"Lifemed Pharma" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Order Confirmed #${order.orderNumber} — Lifemed Pharma`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a4fa8,#2d7a4f);padding:32px 40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">💊 LIFEMED PHARMA</h1>
        </div>
        <div style="padding:36px 40px;background:#fff;">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:48px;">✅</div>
            <h2 style="color:#1e293b;margin:8px 0 4px;">Order Confirmed!</h2>
            <p style="color:#64748b;margin:0;">Order #${order.orderNumber}</p>
          </div>
          <p style="color:#475569;line-height:1.7;">Dear ${order.customer.name}, your order has been received and is being prepared. We will notify you once it is dispatched.</p>
          <div style="background:#f8fafc;border-radius:10px;padding:16px 20px;margin:20px 0;">
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">Order Total</p>
            <p style="margin:0;font-size:24px;font-weight:800;color:#1a4fa8;">PKR ${order.total.toLocaleString()}</p>
          </div>
          <p style="color:#64748b;font-size:14px;">Questions? Reach us at <a href="mailto:info@lifemedpharma.com" style="color:#1a4fa8;">info@lifemedpharma.com</a> or <a href="https://wa.me/923205342942" style="color:#25d366;">WhatsApp us</a>.</p>
        </div>
        <div style="background:#f1f5f9;padding:16px 40px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">📍 182-D Khayban-e-Ameen, Lahore | 📞 +92 320 5342942</p>
        </div>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendOrderNotification, sendOrderConfirmation };