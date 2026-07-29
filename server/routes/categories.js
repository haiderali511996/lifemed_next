const express = require('express');
const router = express.Router();

const categories = [
  { id: 1, name: 'Medicines', slug: 'medicines', icon: '💊', description: 'Prescription and OTC medicines', color: '#1a4fa8' },
  { id: 2, name: 'Syrups', slug: 'syrups', icon: '🍶', description: 'Liquid formulations and syrups', color: '#2d7a4f' },
  { id: 3, name: 'Creams & Ointments', slug: 'creams', icon: '🧴', description: 'Topical creams and ointments', color: '#1a7a6e' },
  { id: 4, name: 'Serums', slug: 'serums', icon: '💉', description: 'Medical and cosmetic serums', color: '#4a1a8a' },
  { id: 5, name: 'Vitamins & Supplements', slug: 'supplements', icon: '🌿', description: 'Health supplements and vitamins', color: '#7a4a1a' },
  { id: 6, name: 'Skin Care', slug: 'skincare', icon: '✨', description: 'Dermatological skin care products', color: '#8a1a4a' }
];

router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;
