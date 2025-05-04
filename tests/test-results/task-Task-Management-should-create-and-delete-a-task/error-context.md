# Test info

- Name: Task Management >> should create and delete a task
- Location: /Users/ignacioachaval/workspace/src/github/fullstack-app/tests/integration/task.test.js:13:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add Task")')

    at /Users/ignacioachaval/workspace/src/github/fullstack-app/tests/integration/task.test.js:15:16
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | // Get the frontend port from the environment or use default
   4 | const FRONTEND_PORT = process.env.FRONTEND_PORT || '4173';
   5 |
   6 | test.describe('Task Management', () => {
   7 |   test.beforeEach(async ({ page }) => {
   8 |     // Wait for the page to be ready
   9 |     await page.goto(`http://localhost:${FRONTEND_PORT}`);
  10 |     await page.waitForSelector('h1:has-text("Task Manager")');
  11 |   });
  12 |
  13 |   test('should create and delete a task', async ({ page }) => {
  14 |     // Click Add Task button
> 15 |     await page.click('button:has-text("Add Task")');
     |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  16 |
  17 |     // Create a task
  18 |     const taskTitle = `Test Task ${Date.now()}`;
  19 |     await page.fill('label:has-text("Title") + div input', taskTitle);
  20 |     await page.fill('label:has-text("Description") + div textarea', 'Test Description');
  21 |     await page.click('button:has-text("Save")');
  22 |
  23 |     // Verify task was created
  24 |     await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  25 |
  26 |     // Delete the task
  27 |     await page.click(`button:has-text("Delete")`);
  28 |     await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  29 |   });
  30 |
  31 |   test('should toggle task completion status', async ({ page }) => {
  32 |     // Click Add Task button
  33 |     await page.click('button:has-text("Add Task")');
  34 |
  35 |     // Create a task
  36 |     const taskTitle = `Test Task ${Date.now()}`;
  37 |     await page.fill('label:has-text("Title") + div input', taskTitle);
  38 |     await page.fill('label:has-text("Description") + div textarea', 'Test Description');
  39 |     await page.selectOption('label:has-text("Status") + div select', 'completed');
  40 |     await page.click('button:has-text("Save")');
  41 |
  42 |     // Verify status
  43 |     await expect(page.locator(`text=Status: completed`)).toBeVisible();
  44 |
  45 |     // Click Add Task button again
  46 |     await page.click('button:has-text("Add Task")');
  47 |
  48 |     // Update status
  49 |     await page.fill('label:has-text("Title") + div input', taskTitle);
  50 |     await page.fill('label:has-text("Description") + div textarea', 'Test Description');
  51 |     await page.selectOption('label:has-text("Status") + div select', 'pending');
  52 |     await page.click('button:has-text("Save")');
  53 |
  54 |     // Verify status changed
  55 |     await expect(page.locator(`text=Status: pending`)).toBeVisible();
  56 |   });
  57 |
  58 |   test('should validate form submission', async ({ page }) => {
  59 |     // Click Add Task button
  60 |     await page.click('button:has-text("Add Task")');
  61 |
  62 |     // Try to submit empty form
  63 |     await page.click('button:has-text("Save")');
  64 |     await expect(page.locator('text=Title is required')).toBeVisible();
  65 |
  66 |     // Submit with only title
  67 |     await page.fill('label:has-text("Title") + div input', 'Test Title');
  68 |     await page.click('button:has-text("Save")');
  69 |     await expect(page.locator('text=Test Title')).toBeVisible();
  70 |   });
  71 | }); 
```