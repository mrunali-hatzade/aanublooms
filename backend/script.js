const fs = require('fs');
const path = require('path');

const addDeleteRoute = (file, routeName, identifier, getFn, saveFn, extraCode = '') => {
  const filePath = path.join('d:/PROJECTS/Ecommerce2/backend/routes', file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(outer.delete('/:id')) return; // skip if exists
  if (content.includes(outer.delete('/:code')) return;

  const deleteRoute = 
// DELETE /\
router.delete('/:\', (req, res) => {
  let items = \();
  const initialCount = items.length;
  items = items.filter(i => (i.id || i.code || '').toString() !== req.params.\.toString());
  if (items.length === initialCount) return res.status(404).json({ success: false, message: 'Not found' });
  \(items);
  res.json({ success: true, message: 'Deleted successfully' });
});
;
  
  content = content.replace('export default router;', deleteRoute + '\nexport default router;');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}

addDeleteRoute('orders.js', 'orders', 'id', 'getOrders', 'saveOrders');
addDeleteRoute('contact.js', 'contact', 'id', 'getMessages', 'saveMessages');
addDeleteRoute('coupons.js', 'coupons', 'code', 'getCoupons', 'saveCoupons');
addDeleteRoute('customRequests.js', 'customRequests', 'id', 'getRequests', 'saveRequests');
addDeleteRoute('feedback.js', 'feedback', 'id', 'getFeedbacks', 'saveFeedbacks');

