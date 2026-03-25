# Test Plan: OrangeHRM Login — SCRUM-7

## Overview

| Field            | Details                                              |
|------------------|------------------------------------------------------|
| **User Story**   | SCRUM-7 — Successful Login                           |
| **Application**  | OrangeHRM Demo                                       |
| **URL**          | https://opensource-demo.orangehrmlive.com            |
| **Credentials**  | Username: `Admin` / Password: `admin123`             |
| **Created**      | 2026-03-23                                           |
| **Scope**        | Login functionality — authentication, session, UI    |

---

## Acceptance Criteria Coverage

| # | Acceptance Criterion                                              | Covered By        |
|---|-------------------------------------------------------------------|-------------------|
| 1 | User can log in with valid username and password                  | TC-001            |
| 2 | System authenticates credentials against backend/API             | TC-001, TC-002    |
| 3 | User is redirected to dashboard/home page on successful login     | TC-001            |
| 4 | A valid session/token is generated and maintained                 | TC-001, TC-009    |

---

## Test Scenarios

---

### TC-001 — Successful Login with Valid Credentials (Happy Path)

**Priority:** Critical
**Type:** Functional / Happy Path

**Test Data:**
- URL: `https://opensource-demo.orangehrmlive.com`
- Username: `Admin`
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the application URL                     | Login page is displayed with username and password fields, and a Login button |
| 2    | Enter `Admin` in the Username field                 | Username field accepts input and displays the entered text |
| 3    | Enter `admin123` in the Password field              | Password field accepts input and masks characters    |
| 4    | Click the **Login** button                          | Loading indicator appears briefly                    |
| 5    | Wait for navigation to complete                     | User is redirected to the Dashboard/Home page        |
| 6    | Verify the page title or header                     | Dashboard heading (e.g., "Dashboard") is visible     |
| 7    | Verify the user menu / profile name is visible      | "Admin" username or avatar is displayed in the top navigation |

**Expected Final Result:** User is authenticated and lands on the Dashboard page.

---

### TC-002 — Invalid Username

**Priority:** High
**Type:** Negative

**Test Data:**
- Username: `invalidUser`
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `invalidUser` in the Username field           | Field accepts input                                  |
| 3    | Enter `admin123` in the Password field              | Field accepts input                                  |
| 4    | Click the **Login** button                          | Login attempt is made                                |
| 5    | Wait for response                                   | Error message is displayed: "Invalid credentials"    |
| 6    | Verify user remains on the login page               | URL is still the login page; dashboard is NOT shown  |

**Expected Final Result:** Authentication fails; error message is shown; no session is created.

---

### TC-003 — Invalid Password

**Priority:** High
**Type:** Negative

**Test Data:**
- Username: `Admin`
- Password: `wrongPassword`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `Admin` in the Username field                 | Field accepts input                                  |
| 3    | Enter `wrongPassword` in the Password field         | Field accepts input                                  |
| 4    | Click the **Login** button                          | Login attempt is made                                |
| 5    | Wait for response                                   | Error message is displayed: "Invalid credentials"    |
| 6    | Verify user remains on the login page               | URL is still the login page                          |

**Expected Final Result:** Authentication fails with an appropriate error message.

---

### TC-004 — Both Fields Empty

**Priority:** High
**Type:** Negative / Validation

**Test Data:** No input

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Leave Username and Password fields empty            | Fields remain empty                                  |
| 3    | Click the **Login** button                          | Form submission is attempted                         |
| 4    | Observe validation messages                         | Validation error shown: "Required" under each field  |
| 5    | Verify user remains on the login page               | No redirect occurs                                   |

**Expected Final Result:** Inline validation errors displayed for both fields; no API call made.

---

### TC-005 — Username Field Empty

**Priority:** Medium
**Type:** Negative / Validation

**Test Data:**
- Username: *(empty)*
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Leave Username field empty                          | Field remains empty                                  |
| 3    | Enter `admin123` in the Password field              | Field accepts input                                  |
| 4    | Click the **Login** button                          | Form submission is attempted                         |
| 5    | Observe validation on Username field                | Validation error: "Required" shown under Username    |

**Expected Final Result:** Username validation error shown; user stays on login page.

---

### TC-006 — Password Field Empty

**Priority:** Medium
**Type:** Negative / Validation

**Test Data:**
- Username: `Admin`
- Password: *(empty)*

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `Admin` in the Username field                 | Field accepts input                                  |
| 3    | Leave Password field empty                          | Field remains empty                                  |
| 4    | Click the **Login** button                          | Form submission is attempted                         |
| 5    | Observe validation on Password field                | Validation error: "Required" shown under Password    |

**Expected Final Result:** Password validation error shown; user stays on login page.

---

### TC-007 — Case-Sensitive Username

**Priority:** Medium
**Type:** Edge Case

**Test Data:**
- Username: `admin` *(lowercase)*
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `admin` (all lowercase) in the Username field | Field accepts input                                  |
| 3    | Enter `admin123` in the Password field              | Field accepts input                                  |
| 4    | Click the **Login** button                          | Login attempt is made                                |
| 5    | Observe result                                      | Error message displayed OR login succeeds (document actual behavior) |

**Expected Final Result:** Verify and document whether username is case-sensitive.

---

### TC-008 — Whitespace in Username Field

**Priority:** Low
**Type:** Edge Case / Boundary

**Test Data:**
- Username: `  Admin  ` *(with leading/trailing spaces)*
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `  Admin  ` (with spaces) in Username field   | Field accepts input                                  |
| 3    | Enter `admin123` in Password field                  | Field accepts input                                  |
| 4    | Click the **Login** button                          | Login attempt is made                                |
| 5    | Observe result                                      | System should trim whitespace and log in OR show error |

**Expected Final Result:** Whitespace is handled gracefully (trimmed or validation error shown).

---

### TC-009 — Session Persistence After Login

**Priority:** High
**Type:** Functional / Session Management

**Test Data:**
- Username: `Admin`
- Password: `admin123`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Log in successfully (refer to TC-001)               | User lands on Dashboard                              |
| 2    | Open browser DevTools → Application → Cookies       | A session cookie or auth token is present            |
| 3    | Navigate to another internal page (e.g., My Info)   | Page loads without redirecting back to login         |
| 4    | Refresh the current page                            | User remains logged in; session is maintained        |
| 5    | Navigate back to the login URL directly             | User is automatically redirected to Dashboard (not login page) |

**Expected Final Result:** Session persists across page navigations and refresh.

---

### TC-010 — UI Element Validation on Login Page

**Priority:** Medium
**Type:** UI / Navigation

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page loads successfully                        |
| 2    | Verify page title                                   | Browser tab title contains "OrangeHRM"               |
| 3    | Verify OrangeHRM logo is displayed                  | Logo is visible in the header/body                   |
| 4    | Verify "Username" label and input field are present | Label and input field are visible                    |
| 5    | Verify "Password" label and input field are present | Label and input field are visible                    |
| 6    | Verify "Login" button is present and clickable      | Button is visible and enabled                        |
| 7    | Verify "Forgot your password?" link is present      | Link is visible                                      |
| 8    | Click "Forgot your password?" link                  | User is navigated to the password reset page         |

**Expected Final Result:** All UI elements render correctly; navigation links work.

---

### TC-011 — SQL Injection Attempt in Username Field

**Priority:** Medium
**Type:** Security / Negative

**Test Data:**
- Username: `' OR '1'='1`
- Password: `anything`

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Navigate to the login page                          | Login page is displayed                              |
| 2    | Enter `' OR '1'='1` in the Username field           | Field accepts the input as plain text                |
| 3    | Enter `anything` in the Password field              | Field accepts input                                  |
| 4    | Click the **Login** button                          | Login attempt is made                                |
| 5    | Observe result                                      | Login is rejected; error message is shown; no unauthorized access granted |

**Expected Final Result:** Application is not vulnerable to basic SQL injection; authentication fails.

---

### TC-012 — Login Page Direct URL Access When Not Authenticated

**Priority:** Low
**Type:** Navigation / Edge Case

**Steps:**

| Step | Action                                              | Expected Result                                      |
|------|-----------------------------------------------------|------------------------------------------------------|
| 1    | Open a fresh browser (no session)                   | No existing session                                  |
| 2    | Navigate directly to `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index` | Redirect occurs |
| 3    | Observe the final URL and page content              | User is redirected to the login page                 |

**Expected Final Result:** Unauthenticated users cannot access internal pages directly; they are redirected to login.

---

## Test Execution Summary Template

| Test Case | Description                              | Status | Notes |
|-----------|------------------------------------------|--------|-------|
| TC-001    | Successful login (happy path)            |        |       |
| TC-002    | Invalid username                         |        |       |
| TC-003    | Invalid password                         |        |       |
| TC-004    | Both fields empty                        |        |       |
| TC-005    | Username field empty                     |        |       |
| TC-006    | Password field empty                     |        |       |
| TC-007    | Case-sensitive username                  |        |       |
| TC-008    | Whitespace in username                   |        |       |
| TC-009    | Session persistence after login          |        |       |
| TC-010    | UI element validation                    |        |       |
| TC-011    | SQL injection attempt                    |        |       |
| TC-012    | Direct URL access without authentication |        |       |

---

## Test Environment

| Item         | Details                                          |
|--------------|--------------------------------------------------|
| Browser      | Chromium (Playwright default)                    |
| Framework    | Playwright + TypeScript                          |
| Base URL     | https://opensource-demo.orangehrmlive.com        |
| Test Runner  | `npx playwright test`                            |
| Reports      | HTML report (`playwright-report/`)               |
