const fs = require('fs');

const p = 'd:/PROJECTS/Ecommerce2/frontend/src/components/admin/AdminDashboard.jsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Dashboard Recent Orders Table
c = c.replace(/<button onClick=\{\(\) => handleTabChange\('orders'\)\} className="p-1 rounded-md hover:bg-\[\#E9E2DC\] text-\[\#756A65\]" title="View Details">\s*<Eye className="w-3\.5 h-3\.5" \/>\s*<\/button>/g, 
  '<button onClick={() => handleTabChange(\'orders\')} className="p-1 rounded-md hover:bg-[#E9E2DC] text-[#756A65]" title="View Details">\n' +
  '  <Eye className="w-3.5 h-3.5" />\n' +
  '</button>\n' +
  '<button onClick={() => handleDeleteOrder(order.id)} className="p-1 rounded-md hover:bg-red-50 text-red-500" title="Delete Order">\n' +
  '  <Trash2 className="w-3.5 h-3.5" />\n' +
  '</button>');

// 2. Orders Tab Table
c = c.replace(/<button onClick=\{\(\) => setSelectedOrderDetails\(order\)\} className="p-1\.5 rounded-lg bg-\[\#F8F6F3\] hover:bg-\[\#E9E2DC\] text-\[\#3E2B25\] transition-colors" title="View Details">\s*<Eye className="w-4 h-4" \/>\s*<\/button>/g, 
  '<button onClick={() => setSelectedOrderDetails(order)} className="p-1.5 rounded-lg bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] transition-colors" title="View Details">\n' +
  '  <Eye className="w-4 h-4" />\n' +
  '</button>\n' +
  '<button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-colors ml-1" title="Delete Order">\n' +
  '  <Trash2 className="w-4 h-4" />\n' +
  '</button>');

// 3. Custom Requests Tab
c = c.replace(/<button\s+onClick=\{\(\) => setSelectedCustomRequest\(req\)\}\s+className="px-3 py-1\.5 bg-\[\#F8F6F3\] hover:bg-\[\#E9E2DC\] text-\[\#3E2B25\] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"\s*>\s*Review Request\s*<\/button>/g, 
  '<button onClick={() => setSelectedCustomRequest(req)} className="px-3 py-1.5 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">\n' +
  '  Review Request\n' +
  '</button>\n' +
  '<button onClick={() => handleDeleteCustomRequest(req.id)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-1" title="Delete Request">\n' +
  '  <Trash2 className="w-4 h-4" />\n' +
  '</button>');

// 4. Contact Messages Tab
c = c.replace(/<button\s+onClick=\{\(\) => setSelectedEnquiry\(msg\)\}\s+className="px-3 py-1\.5 bg-\[\#F8F6F3\] hover:bg-\[\#E9E2DC\] text-\[\#3E2B25\] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"\s*>\s*View Details\s*<\/button>/g, 
  '<button onClick={() => setSelectedEnquiry(msg)} className="px-3 py-1.5 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">\n' +
  '  View Details\n' +
  '</button>\n' +
  '<button onClick={() => handleDeleteContactMessage(msg.id)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-1" title="Delete Enquiry">\n' +
  '  <Trash2 className="w-4 h-4" />\n' +
  '</button>');

// 5. Feedbacks Tab
// Instead of replacing blindly, let's target the exact feedback button:
//   <button onClick={() => { ... }} className="p-1.5 bg-white text-[#D96C65] ..." title="Approve">
c = c.replace(/<button\s+onClick=\{\(\) => \{\s*const updated = \[...feedbacks\];\s*updated\[index\]\.status = 'approved';\s*setFeedbacks\(updated\);\s*addToast\('Feedback approved', 'success'\);\s*\}\}\s+className="p-1\.5 bg-white text-\[\#D96C65\] hover:bg-\[\#D96C65\] hover:text-white rounded-lg transition-colors"\s+title="Approve"\s*>\s*<CheckCircle2 className="w-4 h-4" \/>\s*<\/button>/g, 
  `$&
  <button onClick={() => handleDeleteFeedback(fb.id)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-1" title="Delete Feedback">
    <Trash2 className="w-4 h-4" />
  </button>`);

// 6. Coupons Tab
// Look for the edit/status button in coupons:
c = c.replace(/<button\s+className="p-1\.5 rounded-lg bg-\[\#F8F6F3\] hover:bg-\[\#E9E2DC\] text-\[\#3E2B25\] transition-colors"\s+title="Edit Coupon"\s*>\s*<Edit2 className="w-4 h-4" \/>\s*<\/button>/g,
  `$&
  <button onClick={() => handleDeleteCoupon(coupon.code)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-colors ml-1" title="Delete Coupon">
    <Trash2 className="w-4 h-4" />
  </button>`);

fs.writeFileSync(p, c, 'utf8');
console.log('UI buttons injected successfully!');
