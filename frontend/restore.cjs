const fs = require('fs');

const p = 'd:/PROJECTS/Ecommerce2/frontend/src/components/admin/AdminDashboard.jsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Navigation updates
c = c.replace(
  /export const AdminDashboard = \(\{ onNavigate \}\) => \{/,
  "export const AdminDashboard = ({ onNavigate, initialTab = 'dashboard' }) => {"
);

c = c.replace(
  /const \[activeTab, setActiveTab\] = useState\('dashboard'\);/,
  "const [activeTab, setActiveTab] = useState(initialTab);\n\n  React.useEffect(() => {\n    if (initialTab && initialTab !== activeTab) {\n      setActiveTab(initialTab);\n    }\n  }, [initialTab]);\n\n  const handleTabChange = (tab) => {\n    setActiveTab(tab);\n    onNavigate('admin', { tab }, false);\n    setSidebarOpen(false);\n  };\n"
);

// 2. Replace all remaining setActiveTab calls (except the declaration)
c = c.replace(/setActiveTab\('/g, "handleTabChange('");

// Wait, some sidebar ones were:
// onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
// Now handleTabChange does setSidebarOpen(false) automatically, but it's harmless if it runs twice.

// 3. Re-inject delete handlers
const handlers = `
  const handleDeleteOrder = async (id) => {
    if (!isAdmin) { addToast('Admin access required', 'error'); return; }
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      const res = await api.deleteOrder(id);
      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== id));
        addToast('Order deleted successfully', 'success');
      }
    } catch (err) { addToast('Error deleting order', 'error'); }
  };

  const handleDeleteCustomRequest = async (id) => {
    if (!isAdmin) { addToast('Admin access required', 'error'); return; }
    if (!window.confirm('Are you sure you want to permanently delete this custom request?')) return;
    try {
      const res = await api.deleteCustomRequest(id);
      if (res.success) {
        setCustomRequests(prev => prev.filter(r => r.id !== id));
        addToast('Custom request deleted', 'success');
      }
    } catch (err) { addToast('Error deleting custom request', 'error'); }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!isAdmin) { addToast('Admin access required', 'error'); return; }
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      const res = await api.deleteContactMessage(id);
      if (res.success) {
        setContactMessages(prev => prev.filter(m => m.id !== id));
        addToast('Message deleted', 'success');
      }
    } catch (err) { addToast('Error deleting message', 'error'); }
  };

  const handleDeleteCouponAPI = async (code) => {
    if (!isAdmin) { addToast('Admin access required', 'error'); return; }
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await api.deleteCoupon(code);
      if (res.success) {
        setCoupons(prev => prev.filter(c => c.code !== code));
        addToast('Coupon deleted', 'success');
      }
    } catch (err) { addToast('Error deleting coupon', 'error'); }
  };

  const handleDeleteFeedback = async (id) => {
    if (!isAdmin) { addToast('Admin access required', 'error'); return; }
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await api.deleteFeedback(id);
      if (res.success) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        addToast('Feedback deleted', 'success');
      }
    } catch (err) { addToast('Error deleting feedback', 'error'); }
  };
`;

c = c.replace('const handleDeleteCustomer = async (cust) => {', handlers + '\n  const handleDeleteCustomer = async (cust) => {');

// The original handleDeleteCoupon from earlier is in the file. Let's remove it and use handleDeleteCouponAPI in UI.
// But we can just leave it or use API one. Let's just use API one in UI.

fs.writeFileSync(p, c, 'utf8');
console.log('Restored handlers and navigation!');
