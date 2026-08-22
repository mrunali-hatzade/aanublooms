import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addDeleteRoute = (file, identifier, getFn, saveFn) => {
  const filePath = path.join(__dirname, 'routes', file);
  let content = fs.readFileSync(filePath, 'utf8');

  const deleteStr = identifier === 'id' ? "router.delete('/:id'" : "router.delete('/:code'";
  if (content.includes(deleteStr)) {
    console.log('Skipping ' + file + ', already has delete route');
    return;
  }

  const deleteRoute = `
// DELETE /:${identifier}
router.delete('/:${identifier}', (req, res) => {
  let items = ${getFn}();
  const initialCount = items.length;
  items = items.filter(i => (i.id || i.code || i._id || '').toString() !== req.params.${identifier}.toString());
  if (items.length === initialCount) return res.status(404).json({ success: false, message: 'Not found' });
  ${saveFn}(items);
  res.json({ success: true, message: 'Deleted successfully' });
});
`;
  
  content = content.replace('export default router;', deleteRoute + '\nexport default router;');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}

addDeleteRoute('orders.js', 'id', 'getOrders', 'saveOrders');
addDeleteRoute('contact.js', 'id', 'getMessages', 'saveMessages');
addDeleteRoute('coupons.js', 'code', 'getCoupons', 'saveCoupons');
addDeleteRoute('customRequests.js', 'id', 'getRequests', 'saveRequests');
addDeleteRoute('feedback.js', 'id', 'getFeedbacks', 'saveFeedbacks');
