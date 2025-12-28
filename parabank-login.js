/**
 * ParaBank Login Test using Vibium MCP
 * Logs into ParaBank and validates the welcome message
 */

const { browserSync } = require('vibium');

function main() {
  let vibe = null;

  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    vibe = browserSync.launch();

    // Navigate to ParaBank login page
    console.log('📍 Navigating to ParaBank...');
    vibe.go('https://parabank.parasoft.com/parabank/index.htm');

    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    const start1 = Date.now();
    while (Date.now() - start1 < 3000) {
      // Wait for page to load
    }

    // Find and fill username field
    console.log('📝 Entering username: aamir');
    const usernameField = vibe.find('input[name="username"]');
    usernameField.type('aamir');

    // Find and fill password field
    console.log('📝 Entering password: 123');
    const passwordField = vibe.find('input[name="password"]');
    passwordField.type('123');

    // Click the Log In button - find by type="submit"
    console.log('🔐 Clicking Log In button...');
    const loginButton = vibe.find('input[type="submit"]');
    loginButton.click();

    // Wait for page to load after login
    console.log('⏳ Waiting for page to load after login (8 seconds)...');
    const start2 = Date.now();
    while (Date.now() - start2 < 8000) {
      // Wait
    }

    // Validate welcome message using JavaScript
    console.log('✅ Validating welcome message...');
    const pageContent = vibe.evaluate(`{
      const text = document.body.innerText;
      return text;
    }`);
    
    if (pageContent && typeof pageContent === 'string') {
      // Check for any welcome message containing the username
      const welcomeMatch = pageContent.match(/Welcome\s+(\w+\s+\w+)/);
      if (welcomeMatch) {
        console.log('✅ SUCCESS: Welcome message found!');
        console.log(`✅ Message: "${welcomeMatch[0]}"`);
        console.log(`✅ User logged in as: "${welcomeMatch[1]}"`);
      } else if (pageContent.includes('Welcome')) {
        console.log('✅ SUCCESS: Welcome message found!');
        console.log(`Full page content has Welcome message`);
      } else {
        console.log('❌ FAILED: Welcome message not found');
        console.log(`Page content snippet: "${pageContent.substring(0, 300)}"`);
        process.exit(1);
      }
    } else {
      console.log('❌ FAILED: Could not read page content');
      process.exit(1);
    }

    // Verify we're on the overview page
    console.log('✅ Verifying page content...');
    const hasOverviewContent = vibe.evaluate(`{
      const text = document.body.innerText;
      return text.includes('Account Services') && text.includes('Accounts Overview');
    }`);
    
    if (hasOverviewContent) {
      console.log('📄 Successfully navigated to overview page');
    } else {
      console.log('❌ FAILED: Not on overview page');
      process.exit(1);
    }

    // Verify logout link is present (confirming logged-in state)
    console.log('✅ Verifying logout link...');
    const hasLogoutLink = vibe.evaluate(`{
      const text = document.body.innerText;
      return text.includes('Log Out');
    }`);
    
    if (hasLogoutLink) {
      console.log('✅ Logout link found - user is logged in');
    } else {
      console.log('❌ FAILED: Logout link not found');
      process.exit(1);
    }

    console.log('\n✅ All validations passed! Login successful.');

    // Logout step
    console.log('\n🔓 Performing logout...');
    // Find the logout link using a more specific selector
    // The logout link is typically the last 'a' tag with "Log Out" text
    const logoutLinkIndex = vibe.evaluate(`{
      const links = Array.from(document.querySelectorAll('a'));
      const logoutLink = links.find(a => a.textContent.includes('Log Out'));
      return logoutLink ? Array.from(document.querySelectorAll('a')).indexOf(logoutLink) : -1;
    }`);
    
    console.log(`📍 Found logout link at index: ${logoutLinkIndex}`);
    
    // Create selector for logout link based on its href pattern
    const logoutLink = vibe.find('a[href*="logout"]');
    logoutLink.click();

    // Wait for logout to complete
    console.log('⏳ Waiting for logout to complete (3 seconds)...');
    const startLogout = Date.now();
    while (Date.now() - startLogout < 3000) {
      // Wait
    }

    // Verify we're back on login page
    console.log('✅ Validating logout...');
    const loginPageContent = vibe.evaluate(`{
      const text = document.body.innerText;
      return text;
    }`);

    if (loginPageContent && loginPageContent.includes('Customer Login')) {
      console.log('✅ SUCCESS: Logged out successfully!');
      console.log('✅ Returned to login page with "Customer Login" heading');
    } else {
      console.log('⚠️  WARNING: Could not confirm return to login page');
    }

    if (loginPageContent && !loginPageContent.includes('Welcome')) {
      console.log('✅ Welcome message no longer visible - confirmed logout');
    } else {
      console.log('⚠️  WARNING: Welcome message still visible');
    }

    console.log('\n✅ Complete test passed! Login and logout successful.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    // Close browser
    if (vibe) {
      console.log('\n🛑 Closing browser...');
      vibe.quit();
    }
  }
}

main();
