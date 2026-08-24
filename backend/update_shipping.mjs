import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://simplifiedworksofficial_db_user:JRNmXBYFngAPmSvk@aanublooms.wgd374u.mongodb.net/aanublooms?retryWrites=true&w=majority&appName=AanuBlooms')
  .then(async () => {
    const db = mongoose.connection.db;
    await db.collection('settings').updateOne(
      { key: 'global_store_settings' },
      { $set: { 'shipping.standardCharge': 0, 'shipping.freeShippingThreshold': 0, 'shipping.expressCharge': 0 } }
    );
    console.log('Successfully updated shipping charges to 0 in MongoDB!');
    process.exit(0);
  })
  .catch(console.error);
