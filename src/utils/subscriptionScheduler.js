import cron from 'node-cron';
import moment from 'moment';
import Subscription from '../models/subscription.model.js'; // Assuming your subscription model is here

// This cron job runs once a day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running subscription expiration check...');

    // Find all active subscriptions where the end date has passed
    const expiredSubscriptions = await Subscription.find({
      isActive: true,
      endDate: { $lt: new Date() }, // Check if the end date is in the past
    });

    // Update the subscriptions' isActive status to false
    if (expiredSubscriptions.length > 0) {
      await Subscription.updateMany(
        { _id: { $in: expiredSubscriptions.map(sub => sub._id) } },
        { $set: { isActive: false } }
      );
      console.log(`Deactivated ${expiredSubscriptions.length} expired subscriptions.`);
    } else {
      console.log('No expired subscriptions found.');
    }
  } catch (error) {
    console.error('Error during subscription expiration check:', error);
  }
});
