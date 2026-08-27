import dotenv from 'dotenv';
dotenv.config();

const PHONE_NUMBER_ID = process.env.META_WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WA_ACCESS_TOKEN;
const OWNER_WA_NUMBER = process.env.OWNER_WA_NUMBER || '919579162154'; // Fallback to provided owner number

/**
 * Sends a WhatsApp text message using Meta's Official Cloud API
 * @param {string} text - The message content to send
 */
export const sendWhatsAppNotification = async (text) => {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('WhatsApp API credentials (META_WA_PHONE_NUMBER_ID, META_WA_ACCESS_TOKEN) not configured. Skipping WhatsApp notification.');
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: OWNER_WA_NUMBER,
        type: 'text',
        text: {
          preview_url: false,
          body: text
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Meta WhatsApp API Error:', data);
    } else {
      console.log('WhatsApp notification sent successfully.');
    }
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
};
