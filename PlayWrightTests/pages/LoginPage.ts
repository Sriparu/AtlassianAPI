import { Page, Locator, expect } from '@playwright/test';

export const BASE_URL = 'https://opensource-demo.orangehrmlive.com';
export const LOGIN_URL = `${BASE_URL}/web/index.php/auth/login`;
export const DASHBOARD_URL = `${BASE_URL}/web/index.php/dashboard/index`;

export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput  = page.getByPlaceholder('Username');
    this.passwordInput  = page.getByPlaceholder('Password');
    this.loginButton    = page.getByRole('button', { name: 'Login' });
    this.errorAlert     = page.locator('.oxd-alert-content-text');
    this.usernameError  = page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('.oxd-text--span');
    this.passwordError  = page.locator('.oxd-input-group').filter({ hasText: 'Password' }).locator('.oxd-text--span');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.logo           = page.locator('.orangehrm-login-logo');
  }

  async goto() {
    await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    // Wait for the login form to be interactive
    await this.loginButton.waitFor({ state: 'visible', timeout: 20000 });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(new RegExp('/auth/login'));
  }

  async expectOnDashboard() {
    await expect(this.page).toHaveURL(new RegExp('/dashboard/index'));
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }
}
