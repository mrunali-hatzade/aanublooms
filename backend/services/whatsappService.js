import dotenv from 'dotenv';
dotenv.config();

const PHONE_NUMBER_ID = process.env.META_WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WA_ACCESS_TOKEN;
const getOwnerNumber = () => {
  let rawNumber = process.env.OWNER_WA_NUMBER || '919767355347';
  let num = rawNumber.replace(/\D/g, '');
  if (num.length === 10) {
    num = '91' + num;
  }
  return num;
};

/**
 * Sends a WhatsApp template message using Meta's Official Cloud API
 * @param {string} templateName - The name of the approved template
 * @param {string} languageCode - Language code (e.g., 'en_US' or 'en')
 * @param {Array<string>} parameters - Array of strings to fill the variables {{1}}, {{2}}, etc.
 */
export const sendWhatsAppTemplate = async (templateName, languageCode = 'en_US', parameters = []) => {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('WhatsApp API credentials not configured. Skipping WhatsApp template notification.');
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
        to: getOwnerNumber(),
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: [
            {
              type: 'body',
              parameters: parameters.map(p => ({ type: 'text', text: String(p) }))
            }
          ]
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Meta WhatsApp API Error [${templateName}]:`, data);
    } else {
      console.log(`WhatsApp template notification '${templateName}' sent successfully.`);
    }
  } catch (error) {
    console.error(`Failed to send WhatsApp template '${templateName}':`, error);
  }
};
