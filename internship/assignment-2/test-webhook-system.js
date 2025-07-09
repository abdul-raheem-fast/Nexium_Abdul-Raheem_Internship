#!/usr/bin/env node

/**
 * Comprehensive Webhook System Test Suite
 * Tests all endpoints and functionality for Day 8 n8n integration
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  webhook: {
    quotes: '/api/webhook/quotes',
    summarize: '/api/summarize'
  },
  testData: {
    sampleBlogUrl: 'https://blog.example.com/test-article',
    categories: ['motivation', 'success', 'wisdom', 'life', 'love', 'happiness', 'strength', 'dreams'],
    triggers: ['webhook_test', 'generate_quotes', 'daily_inspiration', 'category_summary']
  }
};

class WebhookTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colorCode = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m'
    };
    
    console.log(`${colorCode[type]}[${timestamp}] ${message}\x1b[0m`);
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, config.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Webhook-Tester/1.0'
        }
      };

      if (data) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = responseData ? JSON.parse(responseData) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed,
              raw: responseData
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: responseData,
              raw: responseData
            });
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async testQuoteWebhook() {
    this.log('🚀 Testing Quote Webhook Endpoints', 'info');

    // Test 1: Webhook Test Trigger
    try {
      const response = await this.makeRequest(config.webhook.quotes, 'POST', {
        trigger: 'webhook_test'
      });

      if (response.status === 200 && response.data.success) {
        this.log('✅ Webhook Test: PASSED', 'success');
        this.results.push({ test: 'webhook_test', status: 'PASSED', response: response.data });
      } else {
        this.log('❌ Webhook Test: FAILED', 'error');
        this.results.push({ test: 'webhook_test', status: 'FAILED', error: response.data });
      }
    } catch (error) {
      this.log(`❌ Webhook Test: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'webhook_test', status: 'ERROR', error: error.message });
    }

    // Test 2: Generate Quotes by Category
    for (const category of config.testData.categories.slice(0, 3)) {
      try {
        const response = await this.makeRequest(config.webhook.quotes, 'POST', {
          trigger: 'generate_quotes',
          category: category,
          count: 2
        });

        if (response.status === 200 && response.data.success && response.data.data.quotes.length > 0) {
          this.log(`✅ Generate Quotes (${category}): PASSED`, 'success');
          this.results.push({ 
            test: `generate_quotes_${category}`, 
            status: 'PASSED', 
            quotes_count: response.data.data.quotes.length 
          });
        } else {
          this.log(`❌ Generate Quotes (${category}): FAILED`, 'error');
          this.results.push({ test: `generate_quotes_${category}`, status: 'FAILED', error: response.data });
        }
      } catch (error) {
        this.log(`❌ Generate Quotes (${category}): ERROR - ${error.message}`, 'error');
        this.results.push({ test: `generate_quotes_${category}`, status: 'ERROR', error: error.message });
      }

      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Test 3: Daily Inspiration
    try {
      const response = await this.makeRequest(config.webhook.quotes, 'POST', {
        trigger: 'daily_inspiration',
        category: 'motivation'
      });

      if (response.status === 200 && response.data.success) {
        this.log('✅ Daily Inspiration: PASSED', 'success');
        this.results.push({ test: 'daily_inspiration', status: 'PASSED', response: response.data });
      } else {
        this.log('❌ Daily Inspiration: FAILED', 'error');
        this.results.push({ test: 'daily_inspiration', status: 'FAILED', error: response.data });
      }
    } catch (error) {
      this.log(`❌ Daily Inspiration: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'daily_inspiration', status: 'ERROR', error: error.message });
    }

    // Test 4: Category Summary
    try {
      const response = await this.makeRequest(config.webhook.quotes, 'POST', {
        trigger: 'category_summary',
        category: 'wisdom'
      });

      if (response.status === 200 && response.data.success) {
        this.log('✅ Category Summary: PASSED', 'success');
        this.results.push({ test: 'category_summary', status: 'PASSED', response: response.data });
      } else {
        this.log('❌ Category Summary: FAILED', 'error');
        this.results.push({ test: 'category_summary', status: 'FAILED', error: response.data });
      }
    } catch (error) {
      this.log(`❌ Category Summary: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'category_summary', status: 'ERROR', error: error.message });
    }
  }

  async testSummarizeAPI() {
    this.log('📄 Testing Blog Summarize API', 'info');

    try {
      const response = await this.makeRequest(config.webhook.summarize, 'POST', {
        url: 'https://example.com/blog/sample-article'
      });

      if (response.status === 200) {
        this.log('✅ Blog Summarize: PASSED', 'success');
        this.results.push({ test: 'blog_summarize', status: 'PASSED', response: response.data });
      } else {
        this.log('❌ Blog Summarize: FAILED', 'error');
        this.results.push({ test: 'blog_summarize', status: 'FAILED', error: response.data });
      }
    } catch (error) {
      this.log(`❌ Blog Summarize: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'blog_summarize', status: 'ERROR', error: error.message });
    }
  }

  async testInvalidInputs() {
    this.log('🔍 Testing Invalid Input Handling', 'info');

    // Test invalid trigger
    try {
      const response = await this.makeRequest(config.webhook.quotes, 'POST', {
        trigger: 'invalid_trigger'
      });

      if (response.status === 400) {
        this.log('✅ Invalid Trigger Handling: PASSED', 'success');
        this.results.push({ test: 'invalid_trigger', status: 'PASSED' });
      } else {
        this.log('❌ Invalid Trigger Handling: FAILED', 'error');
        this.results.push({ test: 'invalid_trigger', status: 'FAILED' });
      }
    } catch (error) {
      this.log(`❌ Invalid Trigger Handling: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'invalid_trigger', status: 'ERROR', error: error.message });
    }

    // Test missing required fields
    try {
      const response = await this.makeRequest(config.webhook.quotes, 'POST', {});

      if (response.status === 400) {
        this.log('✅ Missing Fields Handling: PASSED', 'success');
        this.results.push({ test: 'missing_fields', status: 'PASSED' });
      } else {
        this.log('❌ Missing Fields Handling: FAILED', 'error');
        this.results.push({ test: 'missing_fields', status: 'FAILED' });
      }
    } catch (error) {
      this.log(`❌ Missing Fields Handling: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'missing_fields', status: 'ERROR', error: error.message });
    }
  }

  async testPerformance() {
    this.log('⚡ Testing Performance', 'info');

    const startTime = Date.now();
    const promises = [];

    // Test concurrent requests
    for (let i = 0; i < 5; i++) {
      promises.push(
        this.makeRequest(config.webhook.quotes, 'POST', {
          trigger: 'generate_quotes',
          category: 'motivation',
          count: 1
        })
      );
    }

    try {
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const successCount = responses.filter(r => r.status === 200).length;

      if (successCount === 5 && duration < 5000) {
        this.log(`✅ Performance Test: PASSED (${duration}ms for 5 concurrent requests)`, 'success');
        this.results.push({ 
          test: 'performance_concurrent', 
          status: 'PASSED', 
          duration: duration,
          success_rate: `${successCount}/5`
        });
      } else {
        this.log(`❌ Performance Test: FAILED (${duration}ms, ${successCount}/5 successful)`, 'error');
        this.results.push({ 
          test: 'performance_concurrent', 
          status: 'FAILED', 
          duration: duration,
          success_rate: `${successCount}/5`
        });
      }
    } catch (error) {
      this.log(`❌ Performance Test: ERROR - ${error.message}`, 'error');
      this.results.push({ test: 'performance_concurrent', status: 'ERROR', error: error.message });
    }
  }

  generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    this.log('\n📊 TEST RESULTS SUMMARY', 'info');
    this.log('='.repeat(50), 'info');
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const errors = this.results.filter(r => r.status === 'ERROR').length;
    const total = this.results.length;

    this.log(`Total Tests: ${total}`, 'info');
    this.log(`Passed: ${passed}`, 'success');
    this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`Errors: ${errors}`, errors > 0 ? 'error' : 'info');
    this.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`, 'info');
    this.log(`Total Duration: ${totalDuration}ms`, 'info');

    this.log('\n📋 DETAILED RESULTS:', 'info');
    this.results.forEach((result, index) => {
      const status = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '🔥';
      this.log(`${index + 1}. ${status} ${result.test}: ${result.status}`, 'info');
      
      if (result.error) {
        this.log(`   Error: ${JSON.stringify(result.error)}`, 'warning');
      }
    });

    // Generate JSON report
    const report = {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
        errors: errors,
        success_rate: ((passed / total) * 100).toFixed(1) + '%',
        duration_ms: totalDuration,
        timestamp: new Date().toISOString()
      },
      tests: this.results,
      config: {
        base_url: config.baseUrl,
        test_categories: config.testData.categories,
        test_triggers: config.testData.triggers
      }
    };

    this.log('\n💾 JSON Report:', 'info');
    console.log(JSON.stringify(report, null, 2));

    return report;
  }

  async runAllTests() {
    this.log('🧪 Starting Comprehensive Webhook System Tests', 'info');
    this.log(`Target URL: ${config.baseUrl}`, 'info');
    this.log('='.repeat(50), 'info');

    await this.testQuoteWebhook();
    await this.testSummarizeAPI();
    await this.testInvalidInputs();
    await this.testPerformance();

    return this.generateReport();
  }
}

// CLI Usage
if (require.main === module) {
  const tester = new WebhookTester();
  
  tester.runAllTests()
    .then(report => {
      const success_rate = parseFloat(report.summary.success_rate);
      process.exit(success_rate >= 80 ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = WebhookTester; 