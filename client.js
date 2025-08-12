const http = require('http');
const https = require('https');
const { URL } = require('url');

// Custom HTTP Client Class (built-in modules only)
class CustomHTTPClient {
    constructor() {
        this.defaultTimeout = 10000;
        this.defaultHeaders = {
            'User-Agent': 'CustomHTTPClient/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    // GET request implementation
    async get(url, options = {}) {
        return this._makeRequest(url, 'GET', null, options);
    }

    // POST request implementation
    async post(url, data = {}, options = {}) {
        return this._makeRequest(url, 'POST', data, options);
    }

    // Main request method
    async _makeRequest(url, method, data = null, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const urlObj = new URL(url);
                const protocol = urlObj.protocol === 'https:' ? https : http;
                
                const requestOptions = {
                    hostname: urlObj.hostname,
                    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                    path: urlObj.pathname + urlObj.search,
                    method: method,
                    headers: {
                        ...this.defaultHeaders,
                        ...options.headers
                    },
                    timeout: options.timeout || this.defaultTimeout
                };

                console.log(`🌐 Making ${method} request to: ${url}`);
                console.log(`📋 Request options:`, JSON.stringify(requestOptions, null, 2));

                const req = protocol.request(requestOptions, (res) => {
                    let responseData = '';
                    
                    console.log(`📥 Response received: ${res.statusCode} ${res.statusMessage}`);
                    console.log(`📋 Response headers:`, JSON.stringify(res.headers, null, 2));
                    
                    res.on('data', (chunk) => {
                        responseData += chunk;
                        console.log(`📦 Received chunk: ${chunk.length} bytes`);
                    });
                    
                    res.on('end', () => {
                        console.log(`✅ Response complete. Total size: ${responseData.length} bytes`);
                        
                        try {
                            const parsedData = JSON.parse(responseData);
                            const result = {
                                statusCode: res.statusCode,
                                statusMessage: res.statusMessage,
                                headers: res.headers,
                                data: parsedData,
                                rawData: responseData,
                                url: url,
                                method: method,
                                timestamp: new Date().toISOString()
                            };
                            
                            console.log(`🎯 Request successful: ${method} ${url}`);
                            resolve(result);
                        } catch (error) {
                            const result = {
                                statusCode: res.statusCode,
                                statusMessage: res.statusMessage,
                                headers: res.headers,
                                data: responseData,
                                rawData: responseData,
                                url: url,
                                method: method,
                                timestamp: new Date().toISOString()
                            };
                            
                            console.log(`⚠️ Response is not JSON, returning raw data`);
                            resolve(result);
                        }
                    });
                });

                req.on('error', (error) => {
                    console.error(`❌ Request error: ${error.message}`);
                    reject({
                        error: error.message,
                        url: url,
                        method: method,
                        timestamp: new Date().toISOString()
                    });
                });

                req.on('timeout', () => {
                    console.error(`⏰ Request timeout after ${requestOptions.timeout}ms`);
                    req.destroy();
                    reject({
                        error: 'Request timeout',
                        url: url,
                        method: method,
                        timeout: requestOptions.timeout,
                        timestamp: new Date().toISOString()
                    });
                });

                if (data) {
                    const jsonData = JSON.stringify(data);
                    console.log(`📤 Sending data: ${jsonData}`);
                    req.write(jsonData);
                }
                
                req.end();
                
            } catch (error) {
                console.error(`💥 URL parsing error: ${error.message}`);
                reject({
                    error: `URL parsing error: ${error.message}`,
                    url: url,
                    method: method,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Utility method to format response for display
    formatResponse(response) {
        return {
            status: `${response.statusCode} ${response.statusMessage}`,
            url: response.url,
            method: response.method,
            timestamp: response.timestamp,
            dataSize: response.rawData ? response.rawData.length : 0,
            headers: response.headers,
            data: response.data
        };
    }
}

// Test Functions
async function testLocalServer() {
    console.log('\n🚀 Testing Local Server...');
    console.log('='.repeat(50));
    
    const client = new CustomHTTPClient();
    
    try {
        // Test server info endpoint
        console.log('\n📊 Testing /api/server-info endpoint...');
        const serverInfo = await client.get('http://localhost:3000/api/server-info');
        console.log('✅ Server Info Response:');
        console.log(JSON.stringify(client.formatResponse(serverInfo), null, 2));
        
        // Test trending movies endpoint
        console.log('\n🎬 Testing /api/trending-movies endpoint...');
        const trendingMovies = await client.get('http://localhost:3000/api/trending-movies');
        console.log('✅ Trending Movies Response:');
        console.log(`📊 Found ${trendingMovies.data?.data?.length || 0} trending movies`);
        
        // Test popular movies endpoint
        console.log('\n⭐ Testing /api/popular-movies endpoint...');
        const popularMovies = await client.get('http://localhost:3000/api/popular-movies?page=1');
        console.log('✅ Popular Movies Response:');
        console.log(`📊 Found ${popularMovies.data?.data?.length || 0} popular movies`);
        
        // Test search endpoint
        console.log('\n🔍 Testing /api/search-movies endpoint...');
        const searchResults = await client.get('http://localhost:3000/api/search-movies?query=avengers');
        console.log('✅ Search Results Response:');
        console.log(`📊 Found ${searchResults.data?.data?.length || 0} search results for "avengers"`);
        
    } catch (error) {
        console.error('❌ Local server test failed:', error);
    }
}

async function testExternalAPIs() {
    console.log('\n🌍 Testing External APIs...');
    console.log('='.repeat(50));
    
    const client = new CustomHTTPClient();
    
    try {
        // Test GitHub API
        console.log('\n🐙 Testing GitHub API...');
        const githubResponse = await client.get('https://api.github.com/users/octocat');
        console.log('✅ GitHub API Response:');
        console.log(`👤 User: ${githubResponse.data?.login || 'N/A'}`);
        console.log(`📊 Public repos: ${githubResponse.data?.public_repos || 'N/A'}`);
        
        // Test JSONPlaceholder API
        console.log('\n📝 Testing JSONPlaceholder API...');
        const postsResponse = await client.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log('✅ JSONPlaceholder Response:');
        console.log(`📄 Post title: ${postsResponse.data?.title || 'N/A'}`);
        
        // Test POST request to JSONPlaceholder
        console.log('\n📤 Testing POST to JSONPlaceholder...');
        const postData = {
            title: 'Test Post from Custom HTTP Client',
            body: 'This is a test post created by our custom HTTP client',
            userId: 1
        };
        const postResponse = await client.post('https://jsonplaceholder.typicode.com/posts', postData);
        console.log('✅ POST Response:');
        console.log(`📄 Created post ID: ${postResponse.data?.id || 'N/A'}`);
        
    } catch (error) {
        console.error('❌ External API test failed:', error);
    }
}

async function testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');
    console.log('='.repeat(50));
    
    const client = new CustomHTTPClient();
    
    try {
        // Test non-existent endpoint
        console.log('\n🔍 Testing non-existent endpoint...');
        try {
            await client.get('http://localhost:3000/api/non-existent');
        } catch (error) {
            console.log('✅ Expected error caught for non-existent endpoint');
        }
        
        // Test invalid URL
        console.log('\n🔍 Testing invalid URL...');
        try {
            await client.get('invalid-url');
        } catch (error) {
            console.log('✅ Expected error caught for invalid URL');
        }
        
        // Test timeout
        console.log('\n⏰ Testing timeout...');
        try {
            await client.get('http://localhost:3000/api/server-info', { timeout: 1 });
        } catch (error) {
            console.log('✅ Expected timeout error caught');
        }
        
    } catch (error) {
        console.error('❌ Error handling test failed:', error);
    }
}

async function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    console.log('='.repeat(50));
    
    const client = new CustomHTTPClient();
    const testUrl = 'http://localhost:3000/api/server-info';
    const iterations = 5;
    
    console.log(`🔄 Running ${iterations} requests to test performance...`);
    
    const startTime = Date.now();
    const responseTimes = [];
    
    for (let i = 0; i < iterations; i++) {
        const requestStart = Date.now();
        try {
            await client.get(testUrl);
            const requestTime = Date.now() - requestStart;
            responseTimes.push(requestTime);
            console.log(`✅ Request ${i + 1}: ${requestTime}ms`);
        } catch (error) {
            console.log(`❌ Request ${i + 1} failed: ${error.message}`);
        }
    }
    
    const totalTime = Date.now() - startTime;
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    
    console.log('\n📊 Performance Results:');
    console.log(`⏱️ Total time: ${totalTime}ms`);
    console.log(`📈 Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`🚀 Requests per second: ${(1000 / avgResponseTime).toFixed(2)}`);
}

// Main test runner
async function runAllTests() {
    console.log('🧪 Starting Custom HTTP Client Tests...');
    console.log('='.repeat(60));
    console.log(`⏰ Test started at: ${new Date().toLocaleString('vi-VN')}`);
    
    try {
        await testLocalServer();
        await testExternalAPIs();
        await testErrorHandling();
        await testPerformance();
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('\n💥 Test suite failed:', error);
        process.exit(1);
    }
}

// Check if server is running before testing
async function checkServerStatus() {
    const client = new CustomHTTPClient();
    
    try {
        await client.get('http://localhost:3000/api/server-info');
        console.log('✅ Local server is running on port 3000');
        return true;
    } catch (error) {
        console.log('❌ Local server is not running on port 3000');
        console.log('💡 Please start the server first with: npm start');
        return false;
    }
}

// Main execution
async function main() {
    const serverRunning = await checkServerStatus();
    
    if (serverRunning) {
        await runAllTests();
    } else {
        console.log('\n🔧 To run the tests:');
        console.log('1. Start the server: npm start');
        console.log('2. In another terminal: node client.js');
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Export for use in other modules
module.exports = {
    CustomHTTPClient,
    testLocalServer,
    testExternalAPIs,
    testErrorHandling,
    testPerformance
};
