import dotenv from 'dotenv';
dotenv.config();

const PHONE_NUMBER_ID = process.env.META_WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WA_ACCESS_TOKEN;
const getOwnerNumber = () => {
  let rawNumber = process.env.OWNER_WA_NUMBER || '919579162154';
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

  const sendWithLang = async (lang) => {
    const payload = {
      messaging_product: 'whatsapp',
      to: getOwnerNumber(),
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: lang
        }
      }
    };

    if (parameters && parameters.length > 0) {
      payload.template.components = [
        {
          type: 'body',
          parameters: parameters.map(p => ({ type: 'text', text: String(p) }))
        }
      ];
    }

    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  };

  try {
    let result = await sendWithLang(languageCode);

    // If Meta returns language code mismatch (e.g. 132001 "does not exist in translation"), retry with alternative language code
    const isLangOrTemplateError = !result.ok && (
      [132000, 132001, 132005, 132015, 132016].includes(result.data?.error?.code) ||
      result.data?.error?.message?.toLowerCase().includes('translation') ||
      result.data?.error?.message?.toLowerCase().includes('language') ||
      result.data?.error?.error_data?.details?.toLowerCase().includes('does not exist')
    );

    if (isLangOrTemplateError) {
      const fallbackLang = (languageCode === 'en' || languageCode === 'en_GB') ? 'en_US' : 'en';
      console.warn(`Meta template '${templateName}' failed with '${languageCode}', retrying with '${fallbackLang}'...`);
      result = await sendWithLang(fallbackLang);
    }

    if (!result.ok) {
      console.error(`Meta WhatsApp API Error [${templateName} to ${getOwnerNumber()}]:`, result.data);
    } else {
      console.log(`✅ WhatsApp template notification '${templateName}' delivered to ${getOwnerNumber()} successfully.`);
    }
  } catch (error) {
    console.error(`Failed to send WhatsApp template '${templateName}':`, error);
  }
};
