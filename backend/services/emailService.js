import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL || 'https://aanublooms.in';
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AanuBlooms <orders@aanublooms.in>';
const HELLO_FROM_EMAIL = process.env.RESEND_HELLO_EMAIL || 'AanuBlooms Studio <hello@aanublooms.in>';
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || 'aanublooms@gmail.com';

// Unified Send Mail Helper: Uses Resend API, falls back to simulation.
const sendMailHelper = async ({ to, subject, html, from = DEFAULT_FROM_EMAIL, replyTo = 'aanublooms@gmail.com' }) => {
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    console.warn(`⚠️ [EMAIL] Skipped sending email: Invalid recipient address "${to}" for subject "${subject}"`);
    return { success: false, message: 'Invalid recipient email address' };
  }

  const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim().replace(/^['"]|['"]$/g, '') : '';
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const data = await resend.emails.send({
        from: from,
        to: to.trim(),
        reply_to: replyTo,
        subject: subject,
        html: html
      });

      if (data?.error) {
        console.warn(`⚠️ Resend API notice for ${to}:`, data.error.message);
        return { success: false, error: data.error.message };
      } else {
        console.log(`⚡ Email successfully sent via Resend API to: ${to} (ID: ${data?.id || 'OK'})`);
        return { success: true, id: data?.id };
      }
    } catch (err) {
      console.error(`❌ Resend API exception for ${to}:`, err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`📢 [EMAIL SIMULATION] From: ${from} | To: ${to} | Subject: "${subject}"`);
  return { success: true, simulated: true };
};

// Helper to get founder email
const getFounderEmail = () => FOUNDER_EMAIL;

// Reusable Email Header
const getEmailHeader = (title = 'AanuBlooms') => `
  <div style="background: linear-gradient(135deg, #D96C65 0%, #C45750 100%); padding: 28px 20px; text-align: center; color: #ffffff; border-radius: 16px 16px 0 0;">
    <div style="font-size: 32px; margin-bottom: 6px; line-height: 1;">🌸</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      <a href="${WEBSITE_URL}" style="color: #ffffff; text-decoration: none;">AanuBlooms</a>
    </h1>
    <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.92; font-weight: 600;">
      Handcrafted Blooms &amp; Everlasting Florals · Pune
    </p>
  </div>
`;

// Reusable Email Footer
const getEmailFooter = () => `
  <div style="background: #F5EFEB; padding: 22px 20px; text-align: center; font-size: 12px; color: #756A65; border-radius: 0 0 16px 16px; border-top: 1px solid #EDE8E2; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
    <p style="margin: 0 0 8px; font-weight: 600; color: #3E2B25;">🌸 AanuBlooms Studio — Handcrafted with patience &amp; love</p>
    <p style="margin: 0 0 10px; font-size: 11px; color: #8A7E78;">
      Pune, Maharashtra, India · <a href="${WEBSITE_URL}" style="color: #D96C65; text-decoration: none; font-weight: bold;">aanublooms.in</a>
    </p>
    <div style="margin-top: 10px; font-size: 11px; color: #8A7E78;">
      <span>Need help? Reply to this email or reach us at </span>
      <a href="mailto:orders@aanublooms.in" style="color: #D96C65; font-weight: 600; text-decoration: none;">orders@aanublooms.in</a>
      <span> | </span>
      <a href="https://wa.me/919579162154" style="color: #16a34a; font-weight: 600; text-decoration: none;">WhatsApp +91 95791 62154</a>
    </div>
  </div>
`;


// ==========================================
// 1. Send Order Confirmation Email to Customer
// ==========================================
export const sendOrderConfirmationToCustomer = async (order) => {
  const customerEmail = order.customer?.email?.trim();
  if (!customerEmail) {
    console.warn('⚠️ [ORDER EMAIL] No customer email provided for order #' + order.id);
    return { success: false, message: 'No customer email provided' };
  }

  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #F0EBE6;">
      <td style="padding: 12px 0; color: #3E2B25; font-size: 14px; line-height: 1.4;">
        <strong style="color: #3E2B25;">${item.name}</strong><br/>
        <span style="font-size: 12px; color: #756A65;">
          Qty: <strong>${item.quantity || 1}</strong>
          ${item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}
          ${item.selectedSize ? ` | Size: ${item.selectedSize}` : ''}
        </span>
      </td>
      <td style="padding: 12px 0; text-align: right; color: #D96C65; font-weight: bold; font-size: 14px; vertical-align: top;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const trackingUrl = `${WEBSITE_URL}/track-order?orderId=${encodeURIComponent(order.id)}`;

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
        ${getEmailHeader('Order Confirmed')}
        
        <div style="padding: 30px 28px 20px;">
          <div style="text-align: center; margin-bottom: 22px;">
            <span style="display: inline-block; background-color: #ECFDF5; color: #047857; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #A7F3D0;">
              ✓ Order Confirmed #${order.id}
            </span>
          </div>

          <h2 style="font-size: 20px; color: #3E2B25; margin: 0 0 10px; font-weight: 700;">
            Thank you for your order, ${order.customer?.name || 'Valued Customer'}! 💖
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 20px;">
            Artisan Aanu has received your order and is handcrafting your everlasting blooms with love, care, and meticulous attention to detail.
          </p>

          <!-- Order Summary Box -->
          <div style="background: #FDFBF9; border-radius: 14px; padding: 18px 20px; border: 1px solid #F0EBE6; margin-bottom: 22px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #756A65; margin-bottom: 14px; border-bottom: 1px dashed #EDE8E2; padding-bottom: 10px;">
              <span><strong>Order ID:</strong> #${order.id}</span>
              <span><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>

            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #EDE8E2; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #5C4D46;">
                <span>Subtotal:</span>
                <span>₹${(order.subtotal || order.total).toLocaleString('en-IN')}</span>
              </div>
              ${order.discountAmount ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #16a34a;">
                <span>Coupon Discount (${order.couponCode || 'APPLIED'}):</span>
                <span>-₹${(order.discountAmount || 0).toLocaleString('en-IN')}</span>
              </div>` : ''}
              ${order.giftWrapFee ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #5C4D46;">
                <span>Gift Packaging:</span>
                <span>₹${order.giftWrapFee}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #5C4D46;">
                <span>Delivery:</span>
                <span>${order.shippingFee === 0 || order.shipping === 0 ? '<strong style="color: #16a34a;">FREE</strong>' : `₹${order.shippingFee || order.shipping}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #3E2B25; margin-top: 10px; padding-top: 10px; border-top: 1px solid #EDE8E2;">
                <span>Total Amount:</span>
                <span style="color: #D96C65;">₹${(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style="font-size: 12px; color: #756A65; margin-top: 4px; text-align: right;">
                Payment Method: <strong>${order.paymentMethod || 'Online Payment'}</strong> (${order.paymentStatus === 'paid' ? 'Paid ✓' : 'Pending'})
              </div>
            </div>
          </div>

          <!-- Shipping Details -->
          <div style="background: #FAF8F5; border-radius: 12px; padding: 16px 18px; margin-bottom: 24px; font-size: 13px; color: #5C4D46; border: 1px solid #F0EBE6;">
            <strong style="color: #3E2B25; display: block; margin-bottom: 6px; font-size: 14px;">📍 Delivery Address:</strong>
            <strong>${order.customer?.name}</strong><br/>
            ${order.customer?.address || ''}<br/>
            ${order.customer?.city || 'Pune'}, ${order.customer?.state || 'Maharashtra'} - ${order.customer?.zip || ''}<br/>
            📞 Phone: ${order.customer?.phone || 'N/A'}
          </div>

          <!-- Track Order CTA Button -->
          <div style="text-align: center; margin: 25px 0 10px;">
            <a href="${trackingUrl}" style="display: inline-block; background: #D96C65; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 30px; box-shadow: 0 4px 12px rgba(217, 108, 101, 0.3);">
              Track Your Order Live →
            </a>
          </div>
        </div>

        ${getEmailFooter()}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: DEFAULT_FROM_EMAIL,
    to: customerEmail,
    subject: `🌸 Order Confirmed! #${order.id} — AanuBlooms Handcrafted Creations`,
    html: htmlContent
  });
};


// ==========================================
// 2. Send Order Status Update to Customer
// ==========================================
export const sendOrderStatusUpdateToCustomer = async (order, status, note) => {
  const customerEmail = order.customer?.email?.trim();
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const trackingUrl = `${WEBSITE_URL}/track-order?orderId=${encodeURIComponent(order.id)}`;

  const statusTitles = {
    placed: 'Order Placed',
    confirmed: 'Order Confirmed & Scheduled',
    handcrafting: 'Handcrafting In Progress 🌸',
    packaging: 'Packed with Care 🎁',
    shipped: 'Shipped & On Its Way! 🚚',
    delivered: 'Delivered! Enjoy Your Blooms 💖',
    cancelled: 'Order Cancelled'
  };

  const statusDescriptions = {
    placed: 'Your order has been received and added to our artisan schedule.',
    confirmed: 'Your order details have been verified and materials are set aside.',
    handcrafting: 'Artisan Aanu is currently weaving and shaping your handmade floral creations.',
    packaging: 'Your handcrafted blooms are carefully gift-wrapped and cushioned for transit.',
    shipped: 'Your package has been handed over to our courier partner and is en route to you!',
    delivered: 'Your AanuBlooms parcel has been delivered! We hope it brings endless joy to your space.',
    cancelled: 'Your order has been cancelled. If you have questions, please reach out to us.'
  };

  const title = statusTitles[status] || `Order Status Updated: ${status.toUpperCase()}`;
  const description = statusDescriptions[status] || `The status for your order #${order.id} is now ${status}.`;

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
        ${getEmailHeader('Order Update')}
        
        <div style="padding: 30px 28px 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #FFF7ED; color: #C2410C; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #FFEDD5;">
              📦 ${title}
            </span>
          </div>

          <h2 style="font-size: 19px; color: #3E2B25; margin: 0 0 10px; font-weight: 700; text-align: center;">
            Hi ${order.customer?.name || 'Customer'}, here's an update on Order #${order.id}
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; text-align: center; margin: 0 0 22px;">
            ${description}
          </p>

          ${note ? `
          <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px; font-size: 13px; color: #92400E;">
            <strong>Studio Note:</strong> ${note}
          </div>` : ''}

          ${order.trackingNumber ? `
          <div style="background: #F0FDF4; border-radius: 12px; padding: 16px 18px; margin-bottom: 22px; font-size: 13px; color: #166534; border: 1px solid #DCFCE7;">
            <strong>🚚 Courier Tracking Number (AWB):</strong><br/>
            <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #15803D;">${order.trackingNumber}</span>
          </div>` : ''}

          <!-- Track CTA -->
          <div style="text-align: center; margin: 25px 0 10px;">
            <a href="${trackingUrl}" style="display: inline-block; background: #D96C65; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 30px; box-shadow: 0 4px 12px rgba(217, 108, 101, 0.3);">
              View Order Details &amp; Status →
            </a>
          </div>
        </div>

        ${getEmailFooter()}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: DEFAULT_FROM_EMAIL,
    to: customerEmail,
    subject: `📦 ${title} — Order #${order.id} (AanuBlooms)`,
    html: htmlContent
  });
};


// ==========================================
// 3. Send New Order Alert to Founder
// ==========================================
export const sendNewOrderAlertToFounder = async (order) => {
  const founderEmail = getFounderEmail();
  const itemsList = (order.items || []).map(item => `
    - ${item.name} x${item.quantity || 1} (${item.selectedColor || 'Standard'}${item.selectedSize ? ` / ${item.selectedSize}` : ''}) — ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
  `).join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">🚨 New Order Received! #${order.id}</h2>
        <p style="font-size: 15px;">A new order of <strong>₹${(order.total || 0).toLocaleString('en-IN')}</strong> has been placed on <strong>aanublooms.in</strong>.</p>
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
        ${order.giftMessage ? `<p style="background: #FFF1F2; padding: 10px; border-radius: 6px; font-size: 13px; color: #BE123C;"><strong>🎁 Gift Note:</strong> "${order.giftMessage}"</p>` : ''}
        <p style="font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Paid'} (${order.paymentStatus || 'pending'})</p>
        <p style="font-size: 17px; color: #D96C65; font-weight: bold;">Total Revenue: ₹${(order.total || 0).toLocaleString('en-IN')}</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    from: DEFAULT_FROM_EMAIL,
    to: founderEmail,
    subject: `🚨 New Order Alert! #${order.id} — ₹${(order.total || 0).toLocaleString('en-IN')} from ${order.customer?.name || 'Customer'}`,
    html: htmlContent
  });
};


// ==========================================
// 4. Send Contact Thank You to Customer
// ==========================================
export const sendContactThankYouToCustomer = async (messageData) => {
  const customerEmail = messageData.email?.trim();
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
        ${getEmailHeader('Message Received')}
        
        <div style="padding: 30px 28px 20px;">
          <h2 style="font-size: 19px; color: #3E2B25; margin: 0 0 12px; font-weight: 700;">
            We received your message, ${messageData.name}! ✉️
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 18px;">
            Thank you for reaching out to <strong>AanuBlooms Studio</strong>. We have received your note regarding <strong>"${messageData.subject || 'your enquiry'}"</strong>.
          </p>

          <div style="background: #FDFBF9; border-radius: 12px; padding: 16px 18px; border: 1px solid #F0EBE6; margin-bottom: 20px; font-size: 13px; color: #5C4D46;">
            <strong style="color: #3E2B25; display: block; margin-bottom: 6px;">Your Message:</strong>
            <p style="margin: 0; font-style: italic; white-space: pre-wrap; color: #756A65;">"${messageData.message}"</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 20px;">
            Artisan Aanu reviews all customer inquiries personally and will respond within <strong>24 hours</strong>.
          </p>

          <div style="text-align: center; margin: 25px 0 10px;">
            <a href="${WEBSITE_URL}" style="display: inline-block; background: #D96C65; color: #ffffff; text-decoration: none; padding: 12px 26px; font-size: 14px; font-weight: 700; border-radius: 30px;">
              Explore Handcrafted Blooms →
            </a>
          </div>
        </div>

        ${getEmailFooter()}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: customerEmail,
    subject: `🌸 We received your message — AanuBlooms Studio`,
    html: htmlContent
  });
};


// ==========================================
// 5. Send Contact Form Alert to Founder
// ==========================================
export const sendContactFormAlert = async (messageData) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">📨 New Contact Message Received!</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${messageData.name}<br/>
          <strong>Email:</strong> <a href="mailto:${messageData.email}">${messageData.email}</a><br/>
          <strong>Phone:</strong> ${messageData.phone || 'N/A'}<br/>
          <strong>Subject:</strong> ${messageData.subject || 'N/A'}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Message:</h3>
        <p style="font-size: 14px; white-space: pre-wrap; background: #fafafa; padding: 12px; border-radius: 6px;">${messageData.message}</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: founderEmail,
    subject: `📨 New Contact Message from ${messageData.name} — ${messageData.subject || 'Enquiry'}`,
    html: htmlContent
  });
};


// ==========================================
// 6. Send Custom Order Confirmation to Customer
// ==========================================
export const sendCustomOrderConfirmationToCustomer = async (customOrder) => {
  const customerEmail = customOrder.customerEmail?.trim();
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const paletteString = Array.isArray(customOrder.colorPalette) ? customOrder.colorPalette.join(', ') : (customOrder.colorPalette || 'Standard');

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
        ${getEmailHeader('Custom Request')}
        
        <div style="padding: 30px 28px 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #FDF2F8; color: #DB2777; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #FCE7F3;">
              ✨ Custom Request Received #${customOrder.id || ''}
            </span>
          </div>

          <h2 style="font-size: 19px; color: #3E2B25; margin: 0 0 12px; font-weight: 700;">
            Thank you, ${customOrder.customerName}! 🎨
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 20px;">
            We have received your custom floral request for a <strong>${customOrder.itemType}</strong>! Artisan Aanu is reviewing your preferences and will reach out via WhatsApp / Email within <strong>24 hours</strong> with design suggestions and pricing.
          </p>

          <div style="background: #FDFBF9; border-radius: 12px; padding: 18px 20px; border: 1px solid #F0EBE6; margin-bottom: 22px; font-size: 13px; color: #5C4D46;">
            <strong style="color: #3E2B25; display: block; margin-bottom: 10px; font-size: 14px;">🌸 Your Request Summary:</strong>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #F0EBE6;">
                <td style="padding: 6px 0; color: #756A65;"><strong>Creation Type:</strong></td>
                <td style="padding: 6px 0; text-align: right; color: #3E2B25;">${customOrder.itemType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F0EBE6;">
                <td style="padding: 6px 0; color: #756A65;"><strong>Color Palette:</strong></td>
                <td style="padding: 6px 0; text-align: right; color: #3E2B25;">${paletteString}</td>
              </tr>
              ${customOrder.estimatedBudget ? `
              <tr style="border-bottom: 1px solid #F0EBE6;">
                <td style="padding: 6px 0; color: #756A65;"><strong>Budget:</strong></td>
                <td style="padding: 6px 0; text-align: right; color: #3E2B25;">₹${customOrder.estimatedBudget}</td>
              </tr>` : ''}
              ${customOrder.specialNotes ? `
              <tr>
                <td style="padding: 6px 0; color: #756A65; vertical-align: top;"><strong>Special Notes:</strong></td>
                <td style="padding: 6px 0; text-align: right; color: #3E2B25;">${customOrder.specialNotes}</td>
              </tr>` : ''}
            </table>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #756A65; text-align: center;">
            Have immediate questions? Connect directly with Artisan Aanu on WhatsApp: 
            <a href="https://wa.me/919579162154" style="color: #16a34a; font-weight: bold; text-decoration: none;">+91 95791 62154</a>
          </p>
        </div>

        ${getEmailFooter()}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: customerEmail,
    subject: `🌸 Custom Order Request Received! — AanuBlooms`,
    html: htmlContent
  });
};


// ==========================================
// 7. Send Custom Order Alert to Founder
// ==========================================
export const sendCustomOrderAlertToFounder = async (customOrder) => {
  const founderEmail = getFounderEmail();
  const paletteString = Array.isArray(customOrder.colorPalette) ? customOrder.colorPalette.join(', ') : (customOrder.colorPalette || 'Standard');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">🎨 New Custom Order Request!</h2>
        <p style="font-size: 15px;">A new custom request has been submitted by <strong>${customOrder.customerName}</strong> on <strong>aanublooms.in</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">👤 Customer Details:</h3>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${customOrder.customerName}<br/>
          <strong>Email:</strong> <a href="mailto:${customOrder.customerEmail}">${customOrder.customerEmail}</a><br/>
          <strong>Phone:</strong> <a href="tel:${customOrder.customerPhone}">${customOrder.customerPhone || 'N/A'}</a><br/>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">🌸 Request Details:</h3>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Item Type:</strong> ${customOrder.itemType}<br/>
          <strong>Budget:</strong> ₹${customOrder.estimatedBudget || 'Not specified'}<br/>
          <strong>Color Palette:</strong> ${paletteString}<br/>
          <strong>Special Notes:</strong> ${customOrder.specialNotes || 'None'}<br/>
          ${customOrder.referenceImage ? `<strong>Reference Photo:</strong> Attached (View in Admin Dashboard)` : ''}
        </p>
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: founderEmail,
    subject: `🎨 New Custom Order Request from ${customOrder.customerName} (${customOrder.itemType})`,
    html: htmlContent
  });
};


// ==========================================
// 8. Send Feedback Thank You to Customer
// ==========================================
export const sendFeedbackThankYouToCustomer = async (feedbackData) => {
  const customerEmail = feedbackData.email?.trim();
  if (!customerEmail) return { success: false, message: 'No customer email provided' };

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 30px 15px; color: #3E2B25;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8E2; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
        ${getEmailHeader('Thank You')}
        
        <div style="padding: 30px 28px 20px;">
          <h2 style="font-size: 19px; color: #3E2B25; margin: 0 0 12px; font-weight: 700;">
            Thank you for your warm review! ⭐
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 16px;">
            Hi <strong>${feedbackData.name || feedbackData.author}</strong>,<br/><br/>
            We truly appreciate you taking a moment to share your experience with AanuBlooms! Every review fuels our passion for slow artisan handcrafting and helps us share our everlasting blooms with more floral lovers across India.
          </p>

          <div style="background: #FDFBF9; border-radius: 12px; padding: 14px 16px; border: 1px solid #F0EBE6; margin-bottom: 20px; font-size: 13px; color: #756A65;">
            <p style="margin: 0; font-style: italic;">"${feedbackData.comment || feedbackData.message}"</p>
            <div style="margin-top: 6px; font-weight: bold; color: #D96C65;">Rating: ${'⭐'.repeat(Number(feedbackData.rating) || 5)}</div>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #5C4D46; margin: 0 0 20px;">
            Thank you for supporting our slow, handmade studio! 🌸
          </p>
        </div>

        ${getEmailFooter()}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: customerEmail,
    subject: `🌸 Thank you for your review! — AanuBlooms`,
    html: htmlContent
  });
};


// ==========================================
// 9. Send Feedback Alert to Founder
// ==========================================
export const sendFeedbackAlert = async (feedbackData) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">⭐ New Feedback/Review Received!</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          <strong>Name:</strong> ${feedbackData.name || feedbackData.author}<br/>
          <strong>Email:</strong> ${feedbackData.email || 'N/A'}<br/>
          <strong>Rating:</strong> ${feedbackData.rating} / 5<br/>
          <strong>Product/Category:</strong> ${feedbackData.productCategory || 'N/A'}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>
        <h3 style="font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Comment:</h3>
        <p style="font-size: 14px; white-space: pre-wrap; background: #fafafa; padding: 12px; border-radius: 6px;">${feedbackData.comment || feedbackData.message}</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    from: HELLO_FROM_EMAIL,
    to: founderEmail,
    subject: `⭐ New Feedback (${feedbackData.rating}/5) from ${feedbackData.name || feedbackData.author}`,
    html: htmlContent
  });
};


// ==========================================
// 10. Send Order Status Update Alert to Founder
// ==========================================
export const sendOrderStatusUpdateAlert = async (order, status, note) => {
  const founderEmail = getFounderEmail();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 25px; color: #333;">
      <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e0e0e0;">
        <h2 style="color: #D96C65; margin-top: 0;">📦 Order Status Updated: #${order.id}</h2>
        <p style="font-size: 14px; line-height: 1.5; margin: 0;">
          The status for order <strong>#${order.id}</strong> (Customer: ${order.customer?.name || 'N/A'}) has been updated to <strong>${status.toUpperCase()}</strong>.
        </p>
        ${note ? `<p style="font-size: 14px; color: #555; margin-top: 10px;"><em>Note: ${note}</em></p>` : ''}
      </div>
    </div>
  `;

  return sendMailHelper({
    from: DEFAULT_FROM_EMAIL,
    to: founderEmail,
    subject: `📦 Order Status Update: #${order.id} is now ${status.toUpperCase()}`,
    html: htmlContent
  });
};
