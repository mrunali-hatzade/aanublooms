import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const customRequestsPath = path.join(__dirname, '../data/customRequests.json');

const router = express.Router();

const getRequests = () => {
  try {
    const data = fs.readFileSync(customRequestsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading custom requests:', err);
    return [];
  }
};

const saveRequests = (requests) => {
  fs.writeFileSync(customRequestsPath, JSON.stringify(requests, null, 2), 'utf8');
};

// GET /api/custom-requests
router.get('/', (req, res) => {
  const requests = getRequests();
  res.json({ success: true, count: requests.length, data: requests });
});

// POST /api/custom-requests
router.post('/', (req, res) => {
  const { customerName, customerEmail, itemType, colorPalette, yarnPreference, specialNotes, estimatedBudget, referenceImage } = req.body;

  if (!customerName || !customerEmail || !itemType) {
    return res.status(400).json({ success: false, message: 'Please provide customer name, email, and item type' });
  }

  const requests = getRequests();
  const newRequest = {
    id: `COMM-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    customerName,
    customerEmail,
    itemType,
    colorPalette: colorPalette || [],
    yarnPreference: yarnPreference || 'Artisan Choice',
    specialNotes: specialNotes || '',
    estimatedBudget: estimatedBudget || '₹1,200 - ₹2,500',
    referenceImage: referenceImage || null,
    status: 'pending_review'
  };

  requests.unshift(newRequest);
  saveRequests(requests);

  res.status(201).json({
    success: true,
    message: 'Custom order request received! Aanu will review and respond via email within 24 hours.',
    data: newRequest
  });
});


// DELETE /:id
router.delete('/:id', (req, res) => {
  let items = getRequests();
  const initialCount = items.length;
  items = items.filter(i => (i.id || i.code || i._id || '').toString() !== req.params.id.toString());
  if (items.length === initialCount) return res.status(404).json({ success: false, message: 'Not found' });
  saveRequests(items);
  res.json({ success: true, message: 'Deleted successfully' });
});

export default router;
