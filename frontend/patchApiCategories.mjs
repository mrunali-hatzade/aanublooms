import fs from 'fs';
import path from 'path';

const p = 'd:/PROJECTS/Ecommerce2/frontend/src/services/api.js';
let c = fs.readFileSync(p, 'utf8');

const newMethods = `
  async addCategory(data) {
    try {
      const res = await fetch(\`\${API_BASE_URL}/products/categories\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  async deleteCategory(id) {
    try {
      const res = await fetch(\`\${API_BASE_URL}/products/categories/\${id}\`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
`;

if (!c.includes('addCategory(data)')) {
  c = c.replace('export const api = {', 'export const api = {\n' + newMethods);
  fs.writeFileSync(p, c, 'utf8');
  console.log('Patched api.js');
}
