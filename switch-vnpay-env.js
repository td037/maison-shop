#!/usr/bin/env node

/**
 * Script to switch between VNPay environments
 * Usage: node switch-vnpay-env.js [demo|test|production]
 */

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env.local');

const environments = {
  demo: {
    VNPAY_TMN_CODE: 'DEMOSHOP',
    VNPAY_HASH_SECRET: 'DEMOSECRETKEY',
    VNPAY_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  },
  test: {
    VNPAY_TMN_CODE: '2QXUI4B4',
    VNPAY_HASH_SECRET: 'RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ',
    VNPAY_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  },
  production: {
    VNPAY_TMN_CODE: 'YOUR_PRODUCTION_TMN_CODE',
    VNPAY_HASH_SECRET: 'YOUR_PRODUCTION_HASH_SECRET',
    VNPAY_URL: 'https://vnpayment.vn/paymentv2/vpcpay.html',
  },
};

const env = process.argv[2] || 'demo';

if (!environments[env]) {
  console.error('❌ Invalid environment. Use: demo, test, or production');
  process.exit(1);
}

try {
  let content = fs.readFileSync(envFile, 'utf8');
  const config = environments[env];

  // Update each config value
  Object.keys(config).forEach((key) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${config[key]}`);
    } else {
      content += `\n${key}=${config[key]}`;
    }
  });

  fs.writeFileSync(envFile, content);
  
  console.log(`✅ Switched to VNPay ${env} environment`);
  console.log(`📝 Configuration:`);
  console.log(`   TMN_CODE: ${config.VNPAY_TMN_CODE}`);
  console.log(`   URL: ${config.VNPAY_URL}`);
  console.log('');
  console.log('🔄 Please restart your server: npm run dev');
} catch (error) {
  console.error('❌ Error updating .env.local:', error.message);
  process.exit(1);
}
