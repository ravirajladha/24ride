import admin from 'firebase-admin';

// Define service account credentials using environment variables
const serviceAccountDriver = {
  type: process.env.DRIVER_TYPE,
  project_id: process.env.DRIVER_PROJECT_ID,
  private_key_id: process.env.DRIVER_PRIVATE_KEY_ID,
  private_key: process.env.DRIVER_PRIVATE_KEY,
  client_email: process.env.DRIVER_CLIENT_EMAIL,
  client_id: process.env.DRIVER_CLIENT_ID,
  token_uri: process.env.DRIVER_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.DRIVER_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.DRIVER_CLIENT_X509_CERT_URL,
  universe_domain: process.env.DRIVER_UNIVERSE_DOMAIN,
};

const serviceAccountCustomer = {
  type: process.env.CUSTOMER_TYPE,
  project_id: process.env.CUSTOMER_PROJECT_ID,
  private_key_id: process.env.CUSTOMER_PRIVATE_KEY_ID,
  private_key: process.env.CUSTOMER_PRIVATE_KEY,
  client_email: process.env.CUSTOMER_CLIENT_EMAIL,
  client_id: process.env.CUSTOMER_CLIENT_ID,
  token_uri: process.env.CUSTOMER_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.CUSTOMER_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CUSTOMER_CLIENT_X509_CERT_URL,
  universe_domain: process.env.CUSTOMER_UNIVERSE_DOMAIN,
};

// Configuration for Firebase apps
const firebaseConfigs = {
  driver: {
    credential: admin.credential.cert(serviceAccountDriver),
  },
  customer: {
    credential: admin.credential.cert(serviceAccountCustomer),
  },
};

// Initialize Firebase apps (if not already initialized elsewhere)
const driverApp = admin.initializeApp(firebaseConfigs.driver, 'driver');
const customerApp = admin.initializeApp(firebaseConfigs.customer, 'customer');

// Initialize Firebase apps
const initializeFirebaseApp = (appName, config) => {
  if (!admin.apps.some(app => app.name === appName)) {
    try {
      admin.initializeApp(config, appName);
      console.log(`${appName} Firebase Admin SDK initialized successfully.`);
    } catch (error) {
      console.error(`Error initializing Firebase Admin SDK for ${appName}:`, error);
    }
  } else {
    console.log(`${appName} Firebase Admin SDK is already initialized.`);
  }
};

// Initialize both apps
initializeFirebaseApp("driver", firebaseConfigs.driver);
initializeFirebaseApp("customer", firebaseConfigs.customer);

// Utility to get the correct Firebase app
const getFirebaseApp = (appName) => {
  const app = admin.apps.find(app => app.name === appName);
  if (!app) {
    console.error(`Firebase app "${appName}" is not initialized.`);
  }
  return app;
};

/**
 * Send a push notification to a single device.
 * @param {String} pushToken - The push token of the device.
 * @param {String} message - The message to send.
 * @param {String} appName - The Firebase app name ("driver" or "customer").
 */
const sendPushNotification = async (pushToken, message, appName) => {
  if (!appName) {
    console.error("Error: appName is undefined. Please provide 'driver' or 'customer'.");
    return;
  }

  const firebaseApp = getFirebaseApp(appName);
  if (!firebaseApp) return;

  const payload = {
    token: pushToken,
    notification: {
      title: "New Notification",
      body: message,
    },
  };

  try {
    const response = await firebaseApp.messaging().send(payload);
    console.log(`Push notification sent successfully using ${appName}. Response: ${response}`);
  } catch (error) {
    console.error(`Error sending push notification with ${appName}: ${error.message}`);
  }
};

/**
 * Send push notifications to multiple devices.
 * @param {Array<String>} pushTokens - The push tokens of the devices.
 * @param {String} message - The message to send.
 * @param {String} appName - The Firebase app name ("driver" or "customer").
 */
const sendBulkPushNotifications = async (pushTokens, message, appName) => {
  if (!appName) {
    console.error("Error: appName is undefined. Please provide 'driver' or 'customer'.");
    return;
  }
  if (!Array.isArray(pushTokens) || pushTokens.length === 0) {
    console.error("Error: No valid push tokens provided.");
    return;
  }

  const firebaseApp = getFirebaseApp(appName);
  if (!firebaseApp) return;

  const messagePayload = {
    notification: {
      title: "24Rides Notification",
      body: message,
    },
    tokens: pushTokens,
  };

  try {
    const response = await firebaseApp.messaging().sendEachForMulticast(messagePayload);
    console.log(`Bulk push notifications sent using ${appName}. Success: ${response.successCount}, Failures: ${response.failureCount}`);

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed token: ${pushTokens[idx]}, Error: ${resp.error.message}`);
        }
      });
    }
  } catch (error) {
    console.error(`Error sending bulk push notifications with ${appName}: ${error.message}`);
  }
};

export {
  sendPushNotification,
  sendBulkPushNotifications,
};
