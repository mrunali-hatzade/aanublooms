import fs from 'fs';
import path from 'path';

const addDeleteRoute = (file, identifier, getFn, saveFn) => {
  const filePath = path.join('d:/PROJECTS/Ecommerce2/backend/routes', file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('router.delete(')) {
    // Check if it already has the exact delete route, wait, some have other delete routes (orders has customer delete)
    if (content.includes('router.delete(/:') || content.includes('router.delete(\'/:')) {
      // Just to be safe, search for 'router.delete(''/:id'''
      // Actually we will just skip if it has 'router.delete(''/:id'')' or code
    }
  }

  const deleteStr = identifier === 'id' ? \outer.delete('/:id'\ : \outer.delete('/:code'\;
  if (content.includes(deleteStr)) return;

  const deleteRoute = \
// DELETE /:\
router.delete('/:\', (req, res) => {
  let items = \();
  const initialCount = items.length;
  items = items.filter(i => (i.id || i.code || '').toString() !== req.params.\.toString());
  if (items.length === initialCount) return res.status(404).json({ success: false, message: 'Not found' });
  \(items);
  res.json({ success: true, message: 'Deleted successfully' });
});
\;
  
  content = content.replace('export default router;', deleteRoute + '\nexport default router;');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}

addDeleteRoute('orders.js', 'id', 'getOrders', 'saveOrders');
addDeleteRoute('contact.js', 'id', 'getMessages', 'saveMessages');
addDeleteRoute('coupons.js', 'code', 'getCoupons', 'saveCoupons');
addDeleteRoute('customRequests.js', 'id', 'getRequests', 'saveRequests');
addDeleteRoute('feedback.js', 'id', 'getFeedbacks', 'saveFeedbacks');

