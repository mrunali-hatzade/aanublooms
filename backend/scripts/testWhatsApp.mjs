import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PHONE_NUMBER_ID = process.env.META_WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WA_ACCESS_TOKEN;
let rawNumber = process.env.OWNER_WA_NUMBER || '919579162154';

// Normalize phone number to international standard (E.164 without '+')
let recipient = rawNumber.replace(/\D/g, '');
if (recipient.length === 10) {
  recipient = '91' + recipient;
}

console.log('--- AanuBlooms WhatsApp Integration Tester ---');
console.log('Phone Number ID:', PHONE_NUMBER_ID || '(Missing)');
console.log('Access Token:', ACCESS_TOKEN ? `${ACCESS_TOKEN.substring(0, 15)}...${ACCESS_TOKEN.substring(ACCESS_TOKEN.length - 10)}` : '(Missing)');
console.log('Recipient Number:', recipient);
console.log('----------------------------------------------');

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
  console.error('ERROR: Missing META_WA_PHONE_NUMBER_ID or META_WA_ACCESS_TOKEN in backend/.env');
  process.exit(1);
}

const templatesToTest = [
  {
    name: 'new_contact_query',
    languages: ['en_US', 'en'],
    params: ['Test Customer', '9876543210', 'Product Inquiry', 'Hi, I want to test WhatsApp notifications for AanuBlooms!']
  },
  {
    name: 'new_custom_request',
    languages: ['en_US', 'en'],
    params: ['Test Custom Client', '9876543210', 'Flower Pot & Bouquet', 'Rs. 1500']
  },
  {
    name: 'new_customer_feedback',
    languages: ['en_US', 'en'],
    params: ['Happy Customer', '5', 'Forever Blooms', 'Loved the handcrafted flowers! Beautiful packaging.']
  },
  {
    name: 'new_order_placed',
    languages: ['en', 'en_US'],
    params: ['ORD-9999', 'Priya Sharma', '1499', 'PAID']
  }
];

async function sendTemplate(templateName, languageCode, parameters) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: recipient,
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
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 500, ok: false, error: error.message };
  }
}

async function runTests() {
  for (const t of templatesToTest) {
    console.log(`\nTesting template: [${t.name}]...`);
    let success = false;
    for (const lang of t.languages) {
      console.log(` -> Trying language code: '${lang}'...`);
      const res = await sendTemplate(t.name, lang, t.params);
      if (res.ok) {
        console.log(`    SUCCESS! Message sent via '${lang}'.`);
        console.log(`    Message ID: ${res.data.messages?.[0]?.id || 'N/A'}`);
        success = true;
        break;
      } else {
        console.log(`    Failed with '${lang}' (HTTP ${res.status}):`);
        console.log(`    Error: ${JSON.stringify(res.data?.error || res.error, null, 2)}`);
      }
    }
    if (!success) {
      console.log(`❌ Template [${t.name}] could not be delivered with any tested language.`);
    }
  }
  console.log('\n--- Finished WhatsApp Integration Tests ---');
}

runTests();
