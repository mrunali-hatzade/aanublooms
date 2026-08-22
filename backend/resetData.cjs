const fs = require('fs');
const path = require('path');
const dataDir = path.join('d:/PROJECTS/Ecommerce2/backend/data');

const reset = (file, content) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(content, null, 2), 'utf8');
  console.log('Reset ' + file);
}

reset('orders.json', []);
reset('customRequests.json', []);
reset('contactMessages.json', []);
// Keep feedack? Wait, feedback might be used on the UI as testimonials. I'll ask or check if it's dummy. I'll clear it too if it's user generated. Let's clear it.
reset('feedbacks.json', []);

let users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json')));
users = users.filter(u => u.role === 'admin');
reset('users.json', users);

