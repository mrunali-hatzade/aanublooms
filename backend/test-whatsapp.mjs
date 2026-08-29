// Quick WhatsApp notification test script
// Run with: node test-whatsapp.mjs

import dotenv from 'dotenv';
dotenv.config();

const PHONE_NUMBER_ID = process.env.META_WA_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WA_ACCESS_TOKEN;
const OWNER_WA_NUMBER = process.env.OWNER_WA_NUMBER;

console.log('🔍 Checking WhatsApp Config...');
console.log('  Phone Number ID:', PHONE_NUMBER_ID ? `✅ Set (${PHONE_NUMBER_ID})` : '❌ Missing');
console.log('  Access Token:', ACCESS_TOKEN ? `✅ Set (length: ${ACCESS_TOKEN.length})` : '❌ Missing');
console.log('  Owner WA Number:', OWNER_WA_NUMBER ? `✅ Set (${OWNER_WA_NUMBER})` : '❌ Missing');
console.log('');

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing credentials. Cannot send test message.');
  process.exit(1);
}

// Test: Try sending using 'new_contact_query' template (most likely approved)
// We'll test one template - change templateName below if needed
const TEMPLATE_TO_TEST = 'new_contact_query';

console.log(`📤 Sending test WP notification using template: "${TEMPLATE_TO_TEST}"...`);
console.log(`   Sending to: +${OWNER_WA_NUMBER}`);
console.log('');

const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    to: OWNER_WA_NUMBER,
    type: 'template',
    template: {
      name: TEMPLATE_TO_TEST,
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Test User' },      // {{1}} - name
            { type: 'text', text: 'test@test.com' },  // {{2}} - email
            { type: 'text', text: '9999999999' },      // {{3}} - phone
            { type: 'text', text: 'This is a test message to verify WP notification is working.' } // {{4}} - message
          ]
        }
      ]
    }
  })
});

const data = await response.json();

if (response.ok) {
  console.log('✅ SUCCESS! WhatsApp notification sent successfully!');
  console.log('   Message ID:', data.messages?.[0]?.id);
  console.log('   Check your WhatsApp at +' + OWNER_WA_NUMBER);
} else {
  console.error('❌ FAILED! WhatsApp API returned an error:');
  console.error('   Status:', response.status);
  console.error('   Error code:', data.error?.code);
  console.error('   Error type:', data.error?.type);
  console.error('   Message:', data.error?.message);
  console.error('   Full response:', JSON.stringify(data, null, 2));
}
