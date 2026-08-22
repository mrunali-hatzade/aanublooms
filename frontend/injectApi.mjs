import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');

let content = fs.readFileSync(apiPath, 'utf8');

const methodsToAdd = `
  async deleteOrder(id) {
    const res = await fetch(\`\${API_BASE_URL}/orders/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  async deleteCustomRequest(id) {
    const res = await fetch(\`\${API_BASE_URL}/custom-requests/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete custom request');
    return res.json();
  },

  async deleteContactMessage(id) {
    const res = await fetch(\`\${API_BASE_URL}/contact/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact message');
    return res.json();
  },

  async deleteCoupon(code) {
    const res = await fetch(\`\${API_BASE_URL}/coupons/\${code}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return res.json();
  },

  async deleteFeedback(id) {
    const res = await fetch(\`\${API_BASE_URL}/feedback/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete feedback');
    return res.json();
  },
`;

if (!content.includes('deleteOrder(id)')) {
  content = content.replace('export const api = {', 'export const api = {' + methodsToAdd);
  fs.writeFileSync(apiPath, content, 'utf8');
  console.log('Added methods to api.js');
} else {
  console.log('api.js already has delete methods');
}
