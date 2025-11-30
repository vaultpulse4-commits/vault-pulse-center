// Quick test for permissions API
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testPermissionsAPI() {
  try {
    console.log('🧪 Testing Permissions API...\n');
    
    // Test 1: Get permissions by category (no auth required for testing)
    console.log('📋 Test 1: GET /api/permissions/by-category');
    const response = await fetch(`${API_URL}/api/permissions/by-category`);
    
    if (!response.ok) {
      console.log(`❌ Status: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.log('Error:', error);
    } else {
      const data = await response.json();
      console.log('✅ Success!');
      console.log(`Categories found: ${Object.keys(data.categories).length}`);
      console.log('Categories:', Object.keys(data.categories).join(', '));
      
      // Count total permissions
      let totalPerms = 0;
      Object.values(data.categories).forEach(perms => {
        totalPerms += perms.length;
      });
      console.log(`Total permissions: ${totalPerms}\n`);
      
      // Show sample from first category
      const firstCategory = Object.keys(data.categories)[0];
      console.log(`Sample from "${firstCategory}":`);
      console.log(JSON.stringify(data.categories[firstCategory][0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPermissionsAPI();
