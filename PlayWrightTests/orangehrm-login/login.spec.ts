import { test, expect } from '@playwright/test';
import { LoginPage, BASE_URL, DASHBOARD_URL } from '../pages/LoginPage';

// ─── Test Data ────────────────────────────────────────────────────────────────
const VALID_USER = 'Admin';
const VALID_PASS = 'admin123';

// ─── Hooks ────────────────────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  // Ensure login page is fully loaded before each test (generous timeout for demo site)
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 15000 });
});

test.afterEach(async ({ page }, testInfo) => {
  // Capture screenshot on failure for evidence
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `test-results/screenshots/${testInfo.title.replace(/\s+/g, '_')}_FAIL.png`,
      fullPage: true,
    });
  }
});

// ─── TC-010: UI Element Validation (run first so page structure is confirmed) ─
test('TC-010: Login page renders all required UI elements', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Page title
  await expect(page).toHaveTitle(/OrangeHRM/);

  // Logo
  await expect(loginPage.logo).toBeVisible();

  // Username field
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.usernameInput).toBeEnabled();

  // Password field
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeEnabled();
  // Password field must mask input
  await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

  // Login button
  await expect(loginPage.loginButton).toBeVisible();
  await expect(loginPage.loginButton).toBeEnabled();

  // Forgot password link
  await expect(loginPage.forgotPasswordLink).toBeVisible();
});

// ─── TC-001: Successful Login (Happy Path) ────────────────────────────────────
test('TC-001: Successful login with valid credentials redirects to Dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(VALID_USER, VALID_PASS);

  // Verify redirect to Dashboard
  await loginPage.expectOnDashboard();

  // Verify user menu is visible (top-right profile area)
  await expect(page.locator('.oxd-userdropdown-name')).toBeVisible();
});

// ─── TC-002: Invalid Username ─────────────────────────────────────────────────
test('TC-002: Login with invalid username shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login('invalidUser', VALID_PASS);

  // OrangeHRM POSTs to /auth/validate then redirects back to /auth/login.
  // Use a 30s timeout so auto-retry covers the full redirect cycle.
  await expect(loginPage.errorAlert).toBeVisible({ timeout: 30000 });
  await expect(loginPage.errorAlert).toContainText('Invalid credentials');

  // User must remain on login page
  await loginPage.expectOnLoginPage();
});

// ─── TC-003: Invalid Password ─────────────────────────────────────────────────
test('TC-003: Login with invalid password shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(VALID_USER, 'wrongPassword');

  await expect(loginPage.errorAlert).toBeVisible({ timeout: 30000 });
  await expect(loginPage.errorAlert).toContainText('Invalid credentials');
  await loginPage.expectOnLoginPage();
});

// ─── TC-004: Both Fields Empty ────────────────────────────────────────────────
test('TC-004: Submitting empty form shows required validation on both fields', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Click login without entering any data
  await loginPage.loginButton.click();

  // Both fields should show "Required"
  await expect(loginPage.usernameError).toBeVisible();
  await expect(loginPage.usernameError).toContainText('Required');

  await expect(loginPage.passwordError).toBeVisible();
  await expect(loginPage.passwordError).toContainText('Required');

  // No redirect
  await loginPage.expectOnLoginPage();
});

// ─── TC-005: Username Field Empty ────────────────────────────────────────────
test('TC-005: Submitting with empty username shows required validation on username', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.passwordInput.fill(VALID_PASS);
  await loginPage.loginButton.click();

  await expect(loginPage.usernameError).toBeVisible();
  await expect(loginPage.usernameError).toContainText('Required');

  await loginPage.expectOnLoginPage();
});

// ─── TC-006: Password Field Empty ────────────────────────────────────────────
test('TC-006: Submitting with empty password shows required validation on password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.usernameInput.fill(VALID_USER);
  await loginPage.loginButton.click();

  await expect(loginPage.passwordError).toBeVisible();
  await expect(loginPage.passwordError).toContainText('Required');

  await loginPage.expectOnLoginPage();
});

// ─── TC-007: Case-Sensitive Username ─────────────────────────────────────────
test('TC-007: Login with lowercase username — document case-sensitivity behavior', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login('admin', VALID_PASS); // lowercase 'admin' vs correct 'Admin'

  // Wait for the final stable URL after the full /auth/validate redirect cycle
  // OrangeHRM redirects: /auth/login → POST /auth/validate → /dashboard or /auth/login
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
  // Allow a moment for any final JS-driven redirects to complete
  await page.waitForTimeout(1500);

  const finalUrl = page.url();

  if (finalUrl.includes('/dashboard/index')) {
    // Login succeeded — username is NOT case-sensitive
    console.log('TC-007 OBSERVATION: Username is NOT case-sensitive — "admin" logs in successfully');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  } else {
    // Login failed — username IS case-sensitive
    console.log('TC-007 OBSERVATION: Username IS case-sensitive — "admin" is rejected');
    await expect(loginPage.errorAlert).toBeVisible({ timeout: 30000 });
  }
  // Test passes either way — this is an observational / documentation test
});

// ─── TC-008: Whitespace in Username ──────────────────────────────────────────
test('TC-008: Username with leading/trailing whitespace is handled gracefully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(`  ${VALID_USER}  `, VALID_PASS);

  // Should either trim and succeed, or show an error — must not crash
  const isOnDashboard = page.url().includes('/dashboard/index');
  if (isOnDashboard) {
    console.log('TC-008 OBSERVATION: Whitespace is trimmed — login succeeded');
    await loginPage.expectOnDashboard();
  } else {
    console.log('TC-008 OBSERVATION: Whitespace causes login failure');
    await loginPage.expectOnLoginPage();
  }
});

// ─── TC-009: Session Persistence After Login ─────────────────────────────────
test('TC-009: Session persists after login — navigation does not trigger re-login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Log in
  await loginPage.login(VALID_USER, VALID_PASS);
  await loginPage.expectOnDashboard();

  // Step 2: Navigate to another internal page
  await page.goto(`${BASE_URL}/web/index.php/pim/viewMyDetails`);
  await expect(page).not.toHaveURL(new RegExp('/auth/login'));

  // Step 3: Refresh the page — session should hold
  await page.reload();
  await expect(page).not.toHaveURL(new RegExp('/auth/login'));

  // Step 4: Verify a session cookie exists
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(
    (c) => c.name.toLowerCase().includes('session') || c.name.toLowerCase().includes('token') || c.name === 'orangehrm'
  );
  expect(sessionCookie, 'A session/auth cookie should exist after login').toBeTruthy();
});

// ─── TC-011: SQL Injection Attempt ───────────────────────────────────────────
test('TC-011: SQL injection in username field is rejected safely', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(`' OR '1'='1`, 'anything');

  // Wait briefly for any response (error alert or redirect)
  await page.waitForTimeout(2000);

  // Must NOT be redirected to dashboard
  const currentUrl = page.url();
  expect(currentUrl).not.toContain('/dashboard/index');

  // Log what was shown (error or just stayed on login)
  console.log('TC-011 URL after SQL injection:', currentUrl);
});

// ─── TC-012: Direct URL Access Without Authentication ────────────────────────
test('TC-012: Accessing dashboard URL without session redirects to login page', async ({ page }) => {
  // Navigate directly to dashboard without logging in first
  await page.goto(DASHBOARD_URL);

  // Should be redirected to login
  await expect(page).toHaveURL(new RegExp('/auth/login'));
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

// ─── TC-001b: Forgot Password Navigation ─────────────────────────────────────
test('TC-010b: Forgot password link navigates to password reset page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.forgotPasswordLink.click();

  // Should navigate away from login to a reset/forgot-password page
  await expect(page).toHaveURL(new RegExp('/auth/requestPasswordResetCode'));
  await expect(page.getByRole('heading', { name: /reset/i })).toBeVisible();
});
