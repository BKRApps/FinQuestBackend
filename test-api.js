const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing FinQuest Backend API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test adding a transaction
    console.log('2. Testing add transaction...');
    const transactionData = {
      amount: 150.75,
      type: 'Test transaction from API',
      category: 'Test',
      subcategory: 'API Testing',
      comments: 'This is a test transaction',
      userId: 1
    };

    const addResponse = await axios.post(`${BASE_URL}/transactions`, transactionData);
    console.log('✅ Transaction added successfully:', addResponse.data);
    console.log('');

    // Test getting transactions
    console.log('3. Testing get transactions...');
    const getResponse = await axios.get(`${BASE_URL}/transactions?userId=1`);
    console.log('✅ Transactions retrieved successfully:', getResponse.data);
    console.log('');

    console.log('🎉 All tests passed! Your API is working correctly.');
    console.log('\n📋 API Endpoints:');
    console.log(`   Health Check: GET ${BASE_URL}/`);
    console.log(`   Add Transaction: POST ${BASE_URL}/transactions`);
    console.log(`   Get Transactions: GET ${BASE_URL}/transactions?userId=1`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. The server is running (npm run dev)');
    console.log('   2. The database is connected');
    console.log('   3. The database schema is set up (npm run db:push)');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 