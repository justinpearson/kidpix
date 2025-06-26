import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automated screenshot and console capture script for KidPix app
 * This script:
 * 1. Starts the dev server using child process
 * 2. Waits for server to be ready
 * 3. Opens the app with browser dev tools
 * 4. Captures a full window screenshot
 * 5. Saves console output to a text file
 * 6. Stops the dev server
 */

async function captureAppScreenshot() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.join(__dirname, '..', 'tests', 'screenshots');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const screenshotPath = path.join(outputDir, `kidpix-app-${timestamp}.png`);
  const consoleLogPath = path.join(outputDir, `console-output-${timestamp}.txt`);
  
  console.log('🚀 Starting KidPix screenshot capture...');
  
  let browser, page;
  const consoleMessages = [];
  const errors = [];

  try {
    // Launch browser with dev tools
    browser = await chromium.launch({
      headless: false, // Show browser window
      devtools: true,  // Open dev tools
      args: [
        '--auto-open-devtools-for-tabs',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    console.log('🌐 Browser launched');

    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 }
    });

    page = await context.newPage();

    // Set up console message capturing
    page.on('console', (msg) => {
      const timestamp = new Date().toISOString();
      const level = msg.type();
      const text = msg.text();
      const location = msg.location();
      
      let logEntry = `[${timestamp}] ${level.toUpperCase()}: ${text}`;
      if (location.url) {
        logEntry += ` (${location.url}:${location.lineNumber})`;
      }
      
      consoleMessages.push(logEntry);
      console.log(`📝 Console ${level}: ${text}`);
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      const timestamp = new Date().toISOString();
      const errorEntry = `[${timestamp}] PAGE ERROR: ${error.message}`;
      errors.push(errorEntry);
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Capture network failures
    page.on('requestfailed', (request) => {
      const timestamp = new Date().toISOString();
      const failureEntry = `[${timestamp}] NETWORK FAILURE: ${request.method()} ${request.url()} - ${request.failure().errorText}`;
      errors.push(failureEntry);
      console.log(`🌐 Network Error: ${request.url()} - ${request.failure().errorText}`);
    });

    console.log('🌍 Navigating to KidPix app...');
    
    // Navigate to the app (assuming dev server is running on localhost:5173)
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    console.log('⏳ Waiting for app to fully load...');
    
    // Wait for the main canvas to be present and visible
    await page.waitForSelector('#kiddopaint', { 
      state: 'visible',
      timeout: 10000 
    });

    // Wait a bit more for animations and full initialization
    await page.waitForTimeout(3000);

    // Open dev tools console tab specifically
    await page.keyboard.press('F12');
    await page.waitForTimeout(1000);

    console.log('📸 Capturing screenshot...');
    
    // Take full window screenshot (including dev tools)
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false, // Capture viewport only (including dev tools)
    });

    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    // Wait a bit more to capture any additional console messages
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
    errors.push(`[${new Date().toISOString()}] SCRIPT ERROR: ${error.message}`);
  } finally {
    // Save console output
    const consoleOutput = [
      '='.repeat(80),
      `KidPix App Console Output - ${new Date().toISOString()}`,
      '='.repeat(80),
      '',
      '📝 CONSOLE MESSAGES:',
      ...consoleMessages,
      '',
      '❌ ERRORS:',
      ...errors,
      '',
      '='.repeat(80)
    ].join('\n');

    fs.writeFileSync(consoleLogPath, consoleOutput);
    console.log(`📋 Console output saved: ${consoleLogPath}`);

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   Console messages: ${consoleMessages.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Screenshot: ${screenshotPath}`);
    console.log(`   Console log: ${consoleLogPath}`);

    if (browser) {
      console.log('🚪 Closing browser...');
      
      // Close all contexts first
      const contexts = browser.contexts();
      for (const context of contexts) {
        await context.close();
      }
      
      // Close browser
      await browser.close();
      console.log('✅ Browser closed');
      
      // Give it a moment to fully close
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Start the dev server using child process
async function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting dev server...');
    
    const server = spawn('yarn', ['dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.join(__dirname, '..')
    });

    let serverReady = false;
    
    // Listen for server ready message
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('📡 Server output:', output.trim());
      
      // Look for the server ready message
      if (output.includes('Local:   http://localhost:5173/') && !serverReady) {
        serverReady = true;
        console.log('✅ Dev server is ready!');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error('❌ Server error:', data.toString());
    });

    server.on('error', (error) => {
      reject(new Error(`Failed to start dev server: ${error.message}`));
    });

    server.on('exit', (code) => {
      if (!serverReady) {
        reject(new Error(`Dev server exited with code ${code} before becoming ready`));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Dev server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

// Wait for dev server to be responsive
async function waitForServerReady(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch('http://localhost:5173');
      if (response.ok) {
        console.log('🌐 Server is responding to requests');
        return true;
      }
    } catch {
      // Server not ready yet
    }
    
    console.log(`⏳ Waiting for server... (attempt ${i + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Server failed to become responsive');
}

// Main execution
(async () => {
  let devServer = null;
  
  try {
    // Start the dev server
    devServer = await startDevServer();
    
    // Wait for server to be fully responsive
    await waitForServerReady();
    
    // Run the screenshot capture
    await captureAppScreenshot();
    
  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
    process.exit(1);
  } finally {
    // Always clean up the dev server
    if (devServer) {
      console.log('🛑 Stopping dev server...');
      devServer.kill('SIGTERM');
      
      // Give it a moment to clean up
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force kill if still running
      if (!devServer.killed) {
        console.log('💀 Force killing dev server...');
        devServer.kill('SIGKILL');
      }
      
      console.log('✅ Dev server stopped');
    }
  }
})().catch(console.error);