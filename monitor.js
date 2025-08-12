const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Network Monitoring Class
class NetworkMonitor {
    constructor() {
        this.metrics = {
            requests: [],
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalResponseTime: 0,
            averageResponseTime: 0,
            requestTypes: {},
            responseCodes: {},
            fileSizes: [],
            startTime: Date.now()
        };
        
        this.logFile = path.join(__dirname, 'network-logs.json');
        this.initializeLogFile();
    }

    // Initialize log file
    initializeLogFile() {
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, JSON.stringify({
                sessions: [],
                summary: {
                    totalSessions: 0,
                    totalRequests: 0,
                    averageSessionDuration: 0
                }
            }, null, 2));
        }
    }

    // Monitor HTTP request
    async monitorRequest(url, method = 'GET', data = null, options = {}) {
        const requestId = this.generateRequestId();
        const startTime = Date.now();
        
        const requestData = {
            id: requestId,
            url: url,
            method: method,
            timestamp: new Date().toISOString(),
            startTime: startTime,
            data: data,
            options: options
        };

        console.log(`🔍 Monitoring request: ${method} ${url}`);
        
        try {
            const result = await this.makeRequest(url, method, data, options);
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const responseData = {
                ...requestData,
                endTime: endTime,
                responseTime: responseTime,
                statusCode: result.statusCode,
                statusMessage: result.statusMessage,
                responseSize: result.rawData ? result.rawData.length : 0,
                success: true,
                error: null
            };
            
            this.recordMetrics(responseData);
            this.logRequest(responseData);
            
            console.log(`✅ Request completed in ${responseTime}ms (${result.statusCode})`);
            return result;
            
        } catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const errorData = {
                ...requestData,
                endTime: endTime,
                responseTime: responseTime,
                statusCode: null,
                statusMessage: null,
                responseSize: 0,
                success: false,
                error: error.message || error
            };
            
            this.recordMetrics(errorData);
            this.logRequest(errorData);
            
            console.log(`❌ Request failed after ${responseTime}ms: ${error.message || error}`);
            throw error;
        }
    }

    // Make HTTP request
    async makeRequest(url, method, data = null, options = {}) {
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
                        'User-Agent': 'NetworkMonitor/1.0',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    timeout: options.timeout || 10000
                };

                const req = protocol.request(requestOptions, (res) => {
                    let responseData = '';
                    
                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const parsedData = JSON.parse(responseData);
                            resolve({
                                statusCode: res.statusCode,
                                statusMessage: res.statusMessage,
                                headers: res.headers,
                                data: parsedData,
                                rawData: responseData
                            });
                        } catch (error) {
                            resolve({
                                statusCode: res.statusCode,
                                statusMessage: res.statusMessage,
                                headers: res.headers,
                                data: responseData,
                                rawData: responseData
                            });
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('Request timeout'));
                });

                if (data) {
                    req.write(JSON.stringify(data));
                }
                
                req.end();
                
            } catch (error) {
                reject(error);
            }
        });
    }

    // Record metrics
    recordMetrics(requestData) {
        this.metrics.requests.push(requestData);
        this.metrics.totalRequests++;
        
        if (requestData.success) {
            this.metrics.successfulRequests++;
            this.metrics.totalResponseTime += requestData.responseTime;
            this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.successfulRequests;
        } else {
            this.metrics.failedRequests++;
        }
        
        // Count request types
        this.metrics.requestTypes[requestData.method] = (this.metrics.requestTypes[requestData.method] || 0) + 1;
        
        // Count response codes
        if (requestData.statusCode) {
            this.metrics.responseCodes[requestData.statusCode] = (this.metrics.responseCodes[requestData.statusCode] || 0) + 1;
        }
        
        // Record file sizes for successful requests
        if (requestData.success && requestData.responseSize > 0) {
            this.metrics.fileSizes.push(requestData.responseSize);
        }
    }

    // Log request to file
    logRequest(requestData) {
        try {
            const logData = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
            logData.sessions.push(requestData);
            fs.writeFileSync(this.logFile, JSON.stringify(logData, null, 2));
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }

    // Generate unique request ID
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get current metrics
    getMetrics() {
        const uptime = Date.now() - this.metrics.startTime;
        const uptimeMinutes = Math.floor(uptime / 60000);
        
        return {
            ...this.metrics,
            uptime: uptimeMinutes,
            successRate: this.metrics.totalRequests > 0 ? 
                (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2) + '%' : '0%',
            averageFileSize: this.metrics.fileSizes.length > 0 ? 
                Math.round(this.metrics.fileSizes.reduce((a, b) => a + b, 0) / this.metrics.fileSizes.length) : 0
        };
    }

    // Generate performance report
    generateReport() {
        const metrics = this.getMetrics();
        
        console.log('\n📊 Network Performance Report');
        console.log('='.repeat(50));
        console.log(`⏰ Session Duration: ${metrics.uptime} minutes`);
        console.log(`📈 Total Requests: ${metrics.totalRequests}`);
        console.log(`✅ Successful: ${metrics.successfulRequests}`);
        console.log(`❌ Failed: ${metrics.failedRequests}`);
        console.log(`📊 Success Rate: ${metrics.successRate}`);
        console.log(`⚡ Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
        console.log(`📁 Average File Size: ${metrics.averageFileSize} bytes`);
        
        console.log('\n📋 Request Types:');
        Object.entries(metrics.requestTypes).forEach(([method, count]) => {
            console.log(`  ${method}: ${count}`);
        });
        
        console.log('\n📊 Response Codes:');
        Object.entries(metrics.responseCodes).forEach(([code, count]) => {
            console.log(`  ${code}: ${count}`);
        });
        
        console.log('\n📈 Performance Trends:');
        if (metrics.requests.length > 1) {
            const recentRequests = metrics.requests.slice(-10);
            const recentAvg = recentRequests.reduce((sum, req) => sum + req.responseTime, 0) / recentRequests.length;
            console.log(`  Recent 10 requests average: ${recentAvg.toFixed(2)}ms`);
            
            if (recentAvg < metrics.averageResponseTime) {
                console.log(`  🚀 Performance improving!`);
            } else if (recentAvg > metrics.averageResponseTime) {
                console.log(`  ⚠️ Performance degrading`);
            } else {
                console.log(`  ➡️ Performance stable`);
            }
        }
        
        return metrics;
    }

    // Monitor specific endpoints
    async monitorEndpoints(endpoints) {
        console.log('\n🔍 Starting endpoint monitoring...');
        
        for (const endpoint of endpoints) {
            try {
                await this.monitorRequest(endpoint.url, endpoint.method || 'GET', endpoint.data);
                // Wait between requests to avoid overwhelming the server
                await this.sleep(1000);
            } catch (error) {
                console.log(`❌ Failed to monitor ${endpoint.url}: ${error.message}`);
            }
        }
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Start continuous monitoring
    startContinuousMonitoring(interval = 5000) {
        console.log(`🔄 Starting continuous monitoring every ${interval}ms...`);
        
        this.monitoringInterval = setInterval(async () => {
            const metrics = this.getMetrics();
            console.log(`📊 [${new Date().toLocaleTimeString()}] Requests: ${metrics.totalRequests}, Success Rate: ${metrics.successRate}`);
        }, interval);
    }

    // Stop continuous monitoring
    stopContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('⏹️ Continuous monitoring stopped');
        }
    }

    // Save session summary
    saveSessionSummary() {
        try {
            const logData = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
            const metrics = this.getMetrics();
            
            const sessionSummary = {
                sessionId: `session_${Date.now()}`,
                startTime: new Date(this.metrics.startTime).toISOString(),
                endTime: new Date().toISOString(),
                duration: metrics.uptime,
                totalRequests: metrics.totalRequests,
                successfulRequests: metrics.successfulRequests,
                failedRequests: metrics.failedRequests,
                successRate: metrics.successRate,
                averageResponseTime: metrics.averageResponseTime,
                averageFileSize: metrics.averageFileSize
            };
            
            logData.sessions.push(sessionSummary);
            logData.summary.totalSessions++;
            logData.summary.totalRequests += metrics.totalRequests;
            
            const totalSessions = logData.summary.totalSessions;
            const totalDuration = logData.sessions.reduce((sum, session) => sum + session.duration, 0);
            logData.summary.averageSessionDuration = Math.round(totalDuration / totalSessions);
            
            fs.writeFileSync(this.logFile, JSON.stringify(logData, null, 2));
            console.log('💾 Session summary saved');
            
        } catch (error) {
            console.error('Error saving session summary:', error);
        }
    }
}

// Test monitoring with different scenarios
async function testMonitoring() {
    const monitor = new NetworkMonitor();
    
    console.log('🧪 Testing Network Monitoring...');
    console.log('='.repeat(50));
    
    try {
        // Test local server endpoints
        const localEndpoints = [
            { url: 'http://localhost:3000/api/server-info', method: 'GET' },
            { url: 'http://localhost:3000/api/trending-movies', method: 'GET' },
            { url: 'http://localhost:3000/api/popular-movies?page=1', method: 'GET' },
            { url: 'http://localhost:3000/api/search-movies?query=test', method: 'GET' }
        ];
        
        console.log('\n🏠 Testing local server endpoints...');
        await monitor.monitorEndpoints(localEndpoints);
        
        // Test external APIs
        const externalEndpoints = [
            { url: 'https://api.github.com/users/octocat', method: 'GET' },
            { url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET' },
            { url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST', data: { title: 'Test', body: 'Test body', userId: 1 } }
        ];
        
        console.log('\n🌍 Testing external APIs...');
        await monitor.monitorEndpoints(externalEndpoints);
        
        // Test error scenarios
        console.log('\n⚠️ Testing error scenarios...');
        try {
            await monitor.monitorRequest('http://localhost:3000/api/non-existent');
        } catch (error) {
            console.log('✅ Expected error caught for non-existent endpoint');
        }
        
        try {
            await monitor.monitorRequest('invalid-url');
        } catch (error) {
            console.log('✅ Expected error caught for invalid URL');
        }
        
        // Generate report
        console.log('\n📊 Generating monitoring report...');
        monitor.generateReport();
        
        // Save session
        monitor.saveSessionSummary();
        
    } catch (error) {
        console.error('❌ Monitoring test failed:', error);
    }
}

// Continuous monitoring demo
async function startContinuousMonitoring() {
    const monitor = new NetworkMonitor();
    
    console.log('🔄 Starting continuous monitoring...');
    console.log('Press Ctrl+C to stop');
    
    // Start monitoring
    monitor.startContinuousMonitoring(10000); // Every 10 seconds
    
    // Monitor some endpoints periodically
    const endpoints = [
        'http://localhost:3000/api/server-info',
        'http://localhost:3000/api/trending-movies'
    ];
    
    let endpointIndex = 0;
    const endpointInterval = setInterval(async () => {
        try {
            const url = endpoints[endpointIndex % endpoints.length];
            await monitor.monitorRequest(url);
            endpointIndex++;
        } catch (error) {
            console.log(`❌ Monitoring request failed: ${error.message}`);
        }
    }, 15000); // Every 15 seconds
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping monitoring...');
        clearInterval(endpointInterval);
        monitor.stopContinuousMonitoring();
        monitor.saveSessionSummary();
        process.exit(0);
    });
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--continuous') || args.includes('-c')) {
        await startContinuousMonitoring();
    } else {
        await testMonitoring();
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Export for use in other modules
module.exports = {
    NetworkMonitor,
    testMonitoring,
    startContinuousMonitoring
};
