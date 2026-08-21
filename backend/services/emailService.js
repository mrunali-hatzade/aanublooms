import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter (Uses Gmail SMTP if EMAIL_USER and EMAIL_PASS exist in .env, otherwise logs simulated live emails)
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

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
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #D96C65, #C45750); padding: 25px 20px; text-align: center; color: #ffffff;">
          <div style="font-size: 28px; margin-bottom: 5px;">🌸</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">AanuBlooms</h1>
          <p style="margin: 3px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">Handcrafted Blooms & Creations · Pune</p>
        </div>

        <!-- Body -->
        <div style="padding: 25px 25px 15px;">
          <h2 style="font-size: 18px; color: #3E2B25; margin-top: 0;">Order Confirmed! 💖</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46;">
            Hi <strong>${order.customer?.name || 'Valued Customer'}</strong>, thank you so much for your order! Artisan Aanu is carefully preparing your handmade creations with love and patience.
          </p>

          <!-- Order Summary Card -->
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
              ${order.discount ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #16a34a;">
                  <span>Discount:</span>
                  <span>-₹${order.discount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
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

          <!-- Delivery Address -->
          <div style="background: #FAF8F5; border-radius: 12px; padding: 15px 18px; margin-bottom: 20px; font-size: 13px; color: #5C4D46;">
            <strong style="color: #3E2B25; display: block; margin-bottom: 4px;">📍 Delivery Details:</strong>
            ${order.customer?.name}<br/>
            ${order.customer?.address || ''}, ${order.customer?.city || 'Pune'}, ${order.customer?.state || 'Maharashtra'} - ${order.customer?.zip || ''}<br/>
            📞 Phone: ${order.customer?.phone || 'N/A'}
          </div>

          <p style="font-size: 13px; color: #756A65; line-height: 1.5; margin-bottom: 0;">
            If you have any questions or custom notes, feel free to reach out to us at <strong>${founderEmail}</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #F5EFEB; padding: 15px 20px; text-align: center; font-size: 12px; color: #8A7E78;">
          🌸 AanuBlooms · Handcrafted with love in Pune, Maharashtra.
        </div>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"AanuBlooms Studio" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `🌸 Order Confirmed! #${order.id} — AanuBlooms Handcrafted Creations`,
        html: htmlContent
      });
      console.log(`✉️ Customer confirmation email sent to: ${customerEmail}`);
      return { success: true };
    } catch (err) {
      console.error('❌ Error sending customer email via SMTP:', err.message);
    }
  } else {
    console.log(`📢 [EMAIL SIMULATION] Customer confirmation prepared for: ${customerEmail} (Order #${order.id})`);
  }

  return { success: true, simulated: true };
};

// 2. Send New Order Alert Email to Founder
export const sendNewOrderAlertToFounder = async (order) => {
  const founderEmail = process.env.FOUNDER_EMAIL || 'mrunalithatzade20@gmail.com';

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

        ${order.giftWrap ? `<p style="background: #fff3f3; color: #c45750; padding: 10px; border-radius: 6px; font-size: 13px;">🎁 <strong>Gift Wrap Requested:</strong> "${order.giftMessage || 'No custom note'}"</p>` : ''}

        <p style="font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Paid'}</p>
        <p style="font-size: 16px; color: #D96C65;"><strong>Total Revenue: ₹${(order.total || 0).toLocaleString('en-IN')}</strong></p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"AanuBlooms Store Bot" <${process.env.EMAIL_USER}>`,
        to: founderEmail,
        subject: `🚨 New Order Alert! #${order.id} — ₹${(order.total || 0).toLocaleString('en-IN')} from ${order.customer?.name || 'Customer'}`,
        html: htmlContent
      });
      console.log(`✉️ Founder order alert sent to: ${founderEmail}`);
      return { success: true };
    } catch (err) {
      console.error('❌ Error sending founder email via SMTP:', err.message);
    }
  } else {
    console.log(`📢 [EMAIL SIMULATION] Founder notification alert prepared for: ${founderEmail} (Order #${order.id} - ₹${order.total})`);
  }

  return { success: true, simulated: true };
};
