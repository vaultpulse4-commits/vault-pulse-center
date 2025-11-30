import webPush from 'web-push';

// Generate VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();

console.log('='.repeat(80));
console.log('VAPID KEYS GENERATED');
console.log('='.repeat(80));
console.log('\nAdd these to your .env file:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@vaultclub.com`);
console.log('\n' + '='.repeat(80));
