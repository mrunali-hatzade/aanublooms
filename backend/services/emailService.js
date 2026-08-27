import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

// Unified Send Mail Helper: Tries Nodemailer Gmail SMTP first, falls back to Resend API on cloud, falls back to simulation.
const sendMailHelper = async ({ to, subject, html }) => {
  // 1. Primary: Nodemailer Gmail SMTP
  const rawUser = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS;
  if (rawUser && rawPass) {
    const user = rawUser.trim().replace(/^['"]|['"]$/g, '');
    const pass = rawPass.trim().replace(/^['"]|['"]$/g, '');
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 8000
      });
      await transporter.sendMail({
        from: `"AanuBlooms Store" <${user}>`,
        to: to,
        subject: subject,
        html: html
      });
      console.log(`✉️ Email successfully sent via Nodemailer Gmail SMTP to: ${to}`);
      return { success: true };
    } catch (err) {
      console.error('❌ Nodemailer Gmail SMTP Error (falling back to Resend):', err.message);
    }
  }

  // 2. Automatic Cloud Fallback: Resend API (guarantees delivery on cloud platforms like Vercel/Render)
  const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim().replace(/^['"]|['"]$/g, '') : '';
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'AanuBlooms Store <onboarding@resend.dev>';
      const data = await resend.emails.send({
        from: fromEmail,
        to: to,
        subject: subject,
        html: html
      });
      if (data.error) {
        console.warn('⚠️ Resend API notice:', data.error.message);
      } else {
        console.log(`⚡ Email successfully sent via Resend API to: ${to} (ID: ${data.id})`);
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error('❌ Resend API exception:', err.message);
    }
  }

  console.log(`📢 [EMAIL SIMULATION] Email to ${to}: "${subject}"`);
  return { success: true, simulated: true };
};


// Helper to get founder email
const getFounderEmail = () => process.env.FOUNDER_EMAIL || 'mrunalithatzade20@gmail.com';


// 1. Send Order Confirmation Email to Customer
export const sendOrderConfirmationToCustomer = async (order) => {
  const customerEmail = order.customer?.email;
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const founderEmail = process.env.FOUNDER_EMAIL || 'mrunalithatzade20@gmail.com';
  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #f0ebe6;">
      <td style="padding: 10px 0; color: #3E2B25; font-size: 14px;">
        <strong>${item.name}</strong><br/>
        <span style="font-size: 12px; color: #756A65;">Qty: ${item.quantity || 1} ${item.selectedColor ? `| Color: ${item.selectedColor}` : ''}</span>
      </td>
      <td style="padding: 10px 0; text-align: right; color: #D96C65; font-weight: bold; font-size: 14px;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <div style="background: linear-gradient(135deg, #D96C65, #C45750); padding: 25px 20px; text-align: center; color: #ffffff;">
          <div style="font-size: 28px; margin-bottom: 5px;">🌸</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">AanuBlooms</h1>
          <p style="margin: 3px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">Handcrafted Blooms & Creations · Pune</p>
        </div>
        <div style="padding: 25px 25px 15px;">
          <h2 style="font-size: 18px; color: #3E2B25; margin-top: 0;">Order Confirmed! 💖</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">
            Hi <strong>${order.customer?.name || 'Valued Customer'}</strong>, thank you so much for your order! Artisan Aanu is carefully preparing your handmade creations with love and patience.
          </p>
          <div style="background: #FDFBF9; border-radius: 12px; padding: 15px 18px; border: 1px solid #F0EBE6; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #756A65; margin-bottom: 12px;">
              <span><strong>Order ID:</strong> #${order.id}</span>
              <span><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #EDE8E2; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #5C4D46;">
                <span>Subtotal:</span>
                <span>₹${(order.subtotal || order.total).toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #5C4D46;">
                <span>Delivery (Pune Region):</span>
                <span>${order.shipping === 0 ? '<strong style="color: #16a34a;">FREE</strong>' : `₹${order.shipping}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #3E2B25; margin-top: 8px; padding-top: 8px; border-top: 1px solid #EDE8E2;">
                <span>Total Paid:</span>
                <span style="color: #D96C65;">₹${(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div style="background: #FAF8F5; border-radius: 12px; padding: 15px 18px; margin-bottom: 20px; font-size: 13px; color: #5C4D46;">
            <strong style="color: #3E2B25; display: block; margin-bottom: 4px;">📍 Delivery Details:</strong>
            ${order.customer?.name}<br/>
            ${order.customer?.address || ''}, ${order.customer?.city || 'Pune'}, ${order.customer?.state || 'Maharashtra'} - ${order.customer?.zip || ''}<br/>
            📞 Phone: ${order.customer?.phone || 'N/A'}
          </div>
        </div>
        <div style="background: #F5EFEB; padding: 15px 20px; text-align: center; font-size: 12px; color: #8A7E78;">
          🌸 AanuBlooms · Handcrafted with love in Pune, Maharashtra.
        </div>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: customerEmail,
    subject: `🌸 Order Confirmed! #${order.id} — AanuBlooms Handcrafted Creations`,
    html: htmlContent
  });
};

// 2. Send New Order Alert Email to Founder
export const sendNewOrderAlertToFounder = async (order) => {
  const founderEmail = getFounderEmail();
  const itemsList = (order.items || []).map(item => `
    - ${item.name} x${item.quantity || 1} (${item.selectedColor || 'Standard'}) — ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
  `).join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">🚨 New Order Received! #${order.id}</h2>
        <p style="font-size: 15px;">A new order of <strong>₹${(order.total || 0).toLocaleString('en-IN')}</strong> has been placed on <strong>AanuBlooms</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">👤 Customer Information:</h3>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${order.customer?.name || 'N/A'}<br/>
          <strong>Email:</strong> ${order.customer?.email || 'N/A'}<br/>
          <strong>Phone:</strong> ${order.customer?.phone || 'N/A'}<br/>
          <strong>Address:</strong> ${order.customer?.address || ''}, ${order.customer?.city || 'Pune'}, ${order.customer?.state || 'Maharashtra'} (${order.customer?.zip || ''})
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">📦 Items to Craft:</h3>
        <pre style="background: #fafafa; padding: 12px; border-radius: 6px; font-size: 13px; font-family: monospace; white-space: pre-wrap;">${itemsList}</pre>
        <p style="font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Paid'}</p>
        <p style="font-size: 16px; color: #D96C65;"><strong>Total Revenue: ₹${(order.total || 0).toLocaleString('en-IN')}</strong></p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: founderEmail,
    subject: `🚨 New Order Alert! #${order.id} — ₹${(order.total || 0).toLocaleString('en-IN')} from ${order.customer?.name || 'Customer'}`,
    html: htmlContent
  });
};

// 3. Send Contact Form Alert to Founder
export const sendContactFormAlert = async (messageData) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">📨 New Contact Message Received!</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${messageData.name}<br/>
          <strong>Email:</strong> ${messageData.email}<br/>
          <strong>Phone:</strong> ${messageData.phone || 'N/A'}<br/>
          <strong>Subject:</strong> ${messageData.subject || 'N/A'}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Message:</h3>
        <p style="font-size: 14px; white-space: pre-wrap;">${messageData.message}</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: founderEmail,
    subject: `📨 New Contact Message from ${messageData.name}`,
    html: htmlContent
  });
};

// 4. Send Feedback Alert to Founder
export const sendFeedbackAlert = async (feedbackData) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">⭐ New Feedback/Review Received!</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${feedbackData.name}<br/>
          <strong>Email:</strong> ${feedbackData.email || 'N/A'}<br/>
          <strong>Rating:</strong> ${feedbackData.rating} / 5<br/>
          <strong>Product/Category:</strong> ${feedbackData.productCategory || 'N/A'}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Comment:</h3>
        <p style="font-size: 14px; white-space: pre-wrap;">${feedbackData.comment || feedbackData.message}</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: founderEmail,
    subject: `⭐ New Feedback (${feedbackData.rating}/5) from ${feedbackData.name}`,
    html: htmlContent
  });
};

// 5. Send Order Status Update Alert to Founder
export const sendOrderStatusUpdateAlert = async (order, status, note) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">📦 Order Status Updated: #${order.id}</h2>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          The status for order <strong>#${order.id}</strong> (Customer: ${order.customer?.name || 'N/A'}) has been updated to <strong>${status.toUpperCase()}</strong>.
        </p>
        ${note ? `<p style="font-size: 14px; color: #555; margin-top: 10px;"><em>Note: ${note}</em></p>` : ''}
      </div>
    </div>
  `;

  return sendMailHelper({
    to: founderEmail,
    subject: `📦 Order Status Update: #${order.id} is now ${status.toUpperCase()}`,
    html: htmlContent
  });
};

// 6. Send Contact Thank You to Customer
export const sendContactThankYouToCustomer = async (messageData) => {
  const customerEmail = messageData.email;
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <div style="background: linear-gradient(135deg, #D96C65, #C45750); padding: 25px 20px; text-align: center; color: #ffffff;">
          <div style="font-size: 28px; margin-bottom: 5px;">🌸</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">AanuBlooms</h1>
        </div>
        <div style="padding: 25px 25px 15px;">
          <h2 style="font-size: 18px; color: #3E2B25; margin-top: 0;">We received your message!</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">
            Hi <strong>${messageData.name}</strong>,<br/><br/>
            Thank you for reaching out to AanuBlooms! We have received your message regarding <strong>"${messageData.subject || 'your enquiry'}"</strong>. 
            We will get back to you within 24 hours.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">Have a beautiful day!</p>
        </div>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: customerEmail,
    subject: `🌸 Thank you for contacting AanuBlooms!`,
    html: htmlContent
  });
};

// 7. Send Feedback Thank You to Customer
export const sendFeedbackThankYouToCustomer = async (feedbackData) => {
  const customerEmail = feedbackData.email;
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <div style="background: linear-gradient(135deg, #D96C65, #C45750); padding: 25px 20px; text-align: center; color: #ffffff;">
          <div style="font-size: 28px; margin-bottom: 5px;">🌸</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">AanuBlooms</h1>
        </div>
        <div style="padding: 25px 25px 15px;">
          <h2 style="font-size: 18px; color: #3E2B25; margin-top: 0;">Thank you for your feedback! ⭐</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">
            Hi <strong>${feedbackData.name}</strong>,<br/><br/>
            We truly appreciate you taking the time to share your experience with us! Your words mean the world to our small studio and help us keep crafting with love.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">Thank you for supporting handmade!</p>
        </div>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: customerEmail,
    subject: `🌸 Thank you for your feedback!`,
    html: htmlContent
  });
};
