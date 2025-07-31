// Simple test script for authentication endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Send magic link
    console.log('1️⃣ Testing magic link endpoint...');
    const magicLinkResponse = await fetch(`${API_BASE}/auth/magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });

    const magicLinkData = await magicLinkResponse.json();
    console.log('✅ Magic link response:', magicLinkData);

    if (magicLinkData.devMagicLink) {
      console.log('🔗 Development magic link:', magicLinkData.devMagicLink);
      
      // Extract token from magic link
      const token = magicLinkData.devMagicLink.split('token=')[1];
      
      // Test 2: Verify magic link
      console.log('\n2️⃣ Testing verify endpoint...');
      const verifyResponse = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        })
      });

      const verifyData = await verifyResponse.json();
      console.log('✅ Verify response:', verifyData);

      if (verifyData.tokens?.accessToken) {
        console.log('🎉 Authentication successful!');
        
        // Test 3: Get user info
        console.log('\n3️⃣ Testing /me endpoint...');
        const meResponse = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${verifyData.tokens.accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        const meData = await meResponse.json();
        console.log('✅ /me response:', meData);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuth(); 