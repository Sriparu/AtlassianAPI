End-to-End QA Workflow with Natural Language
This is a 7-step QA automation workflow using AI agents + Playwright MCP tools.
---------------------------------------------------------------------
STEP 1: Read User Story
🔹 Prompt
I need to start a new testing workflow. Please read the user story from Jira - (https://parusonly.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-7)
 
Summarize the key requirements, acceptance criteria, and testing scope.
🔹 Expected Output
 
Summary of user story
List of acceptance criteria
Application URL & credentials
Key features to test
-----------------------------------------------------------------------
STEP 2: Create Test Plan
🔹 Prompt
Based on the user story SCRUM-7 that we just reviewed, use the playwright-test-planner agent to:
 
1. Read the application URL and test credentials from the user story
2. Explore the application and understand all workflows mentioned in the acceptance criteria
3. Create a comprehensive test plan that covers all acceptance criteria including:
   - Happy path scenarios
   - Negative scenarios (validation errors, empty fields, invalid data)
   - Edge cases and boundary conditions
   - Navigation flow tests
   - UI element validation
 
4. Save the test plan as:
   specs/Orange-test-plan.md
 
Ensure each test scenario includes:
- Clear test case title
- Detailed step-by-step instructions
- Expected results for each step
- Test data requirements
🔹 Expected Output
 
Complete test plan markdown file
Organized test scenarios
Optional browser exploration screenshots
--------------------------------------------------------------------
STEP 3: Perform Exploratory Testing
🔹 Prompt
Now I need to perform manual exploratory testing using Playwright MCP browser tools.
 
Please read the test plan from:
specs/IXL-checkout-test-plan.md
 
Then execute the test scenarios defined in that plan:
 
1. Use Playwright browser tools to manually execute each test scenario
2. Follow step-by-step instructions
3. Verify expected vs actual results
4. Take screenshots at key steps and errors
 
5. Document findings:
   - Test execution results
   - UI inconsistencies
   - Missing validations
   - Bugs discovered
   - Screenshots as evidence
🔹 Expected Output
 
Manual test execution results
 
Screenshots
Observations
Bugs/issues list
---------------------------------------------------------------
STEP 4: Generate Automation Scripts
🔹 Prompt
Now I need to create automated test scripts using the playwright-test-generator agent.
 
Please review:
1. Test plan from: specs/saucedemo-checkout-test-plan.md
2. Exploratory testing results from Step 3
 
Using insights from manual testing:
- Use stable locators (IDs, attributes, roles)
- Apply wait strategies based on UI behavior
- Include workarounds for UI quirks
 
Generate Playwright automation scripts:
1. Create scripts for each test scenario
2. Organize scripts into:
   tests/saucedemo-checkout/
3. Use test case names from test plan
4. Use reliable selectors
 
Requirements:
- Follow Playwright best practices
- Use expect() assertions
- Add comments for complex steps
- Add hooks (beforeEach, afterEach)
- Support multiple browsers (Chrome, Firefox, Safari)
 
After generating scripts, run tests to verify they pass.
----------------------------------------------------------
STEP 5: Execute and Heal Automation Tests
Prompt:
Now I need to execute the generated automation scripts and heal any failures using the playwright-test-healer agent.
 
1. Run all automation scripts in: tests/IXL-checkout/
2. Identify any failing tests
3. For each failing test, use the playwright-test-healer agent to:
   - Analyze the failure (selector issues, timing issues, assertion failures)
   - Auto-heal the test by fixing selectors, adding waits, or adjusting assertions
   - Update the test script with the fixes
4. Re-run the healed tests to verify they pass
5. Repeat the heal process until all tests are stable and passing
6. Document:
   - Initial test results (pass/fail count)
   - Healing activities performed
   - Final test results after healing
   - Any tests that couldn't be auto-healed
Expected Output:
 
All automation tests executed
Failing tests identified and healed using test-healer agent
Healed test scripts updated in tests/saucedemo-checkout/
Final stable test execution results
Summary of healing activities performed
------------------------------------------------------------
STEP 6: Create Test Report
Prompt:
Now I need to create a comprehensive test execution report based on manual testing,
automation execution, and healing activities.
 
Please compile results from:
- Step 3: Manual exploratory testing results
- Step 4: Generated automation scripts
- Step 5: Automated test execution and healing results
 
Structure the report as:
test-results/3-checkout-test-report.md
Include:
1. Executive Summary
 
Total test cases planned
 
Test cases executed (manual + automated)
 
Overall Pass/Fail/Blocked status
 
2. Manual Test Results
 
Results from Step 3 exploratory testing
 
Screenshots and observations
 
Issues found during manual testing
 
3. Automated Test Results
 
Initial automation results from Step 5
 
Healing activities performed
 
Final test execution results after healing
 
Test suite execution summary
 
Pass/Fail count for each test suite
 
4. Defects Log
 
For any failed tests (manual or automated):
 
Bug ID
 
Severity (Critical/High/Medium/Low)
 
Title and Description
 
Steps to Reproduce
 
Expected vs Actual Behavior
 
Screenshots/Evidence
 
Environment Details
 
5. Test Coverage Analysis
 
Which acceptance criteria are covered
 
Coverage from manual vs automated tests
 
Any gaps in test coverage
 
Recommendations for additional testing
 
6. Summary and Recommendations
 
Overall quality assessment
 
Risk areas
 
Next steps
Expected Output
 
Comprehensive test execution report covering both manual and automated testing
 
Clear PASS/FAIL status for all test scenarios
 
Detailed bug reports for failures
 
Complete test coverage analysis
 
Evidence and screenshots attached
---------------------------------------------------------
STEP 7: Commit to Git Repository
Git Repository URL
https://github.com/reddychandana20-png/Agile-Project.git
Prompt:
Now I need to commit all the test artifacts to the Git repository using the GitHub MCP server.
 
Git Repository URL: https://github.com/reddychandana20-png/Agile-Project.git
 
Please perform the following Git operations:
 
1. Initialize Git repository if not already initialized
 
2. Stage all files in the workspace (all new and modified files)
 
3. Create a commit with the message:
"feat(tests): Add complete test suite for SCRUM-101 checkout workflow"
 
- Add user story documentation
- Add comprehensive test plan with all scenarios
- Add test execution report with results
- Add automated test scripts for checkout process
- Include validation, navigation, and edge case tests
 
Resolves "3"
 
4. Push all changes to the Git repository
5. Provide a summary of what was committed
Expected Output:
 
All workspace files committed to Git
 
Descriptive commit message following conventional commit format
 
Confirmation of successful push to the provided repository
 
Summary of changes