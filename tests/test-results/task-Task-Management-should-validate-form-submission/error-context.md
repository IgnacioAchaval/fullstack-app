# Test info

- Name: Task Management >> should validate form submission
- Location: /Users/ignacioachaval/workspace/src/github/fullstack-app/tests/integration/task.test.js:44:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Test Title')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Test Title')

    at /Users/ignacioachaval/workspace/src/github/fullstack-app/tests/integration/task.test.js:52:51
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- text: "Failed to add task: Bad Request"
- textbox "Task title": Test Title
- textbox "Task description"
- button "Add Task"
- table:
  - rowgroup:
    - row "Title Description Status Created At Actions":
      - cell "Title"
      - cell "Description"
      - cell "Status"
      - cell "Created At"
      - cell "Actions"
  - rowgroup
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Wait for the page to be ready
   6 |     await page.goto('http://localhost:4173');
   7 |     await page.waitForSelector('h1:has-text("Task Manager")');
   8 |   });
   9 |
  10 |   test('should create and delete a task', async ({ page }) => {
  11 |     // Create a task
  12 |     const taskTitle = `Test Task ${Date.now()}`;
  13 |     await page.fill('input[name="title"]', taskTitle);
  14 |     await page.fill('input[name="description"]', 'Test Description');
  15 |     await page.click('button[type="submit"]');
  16 |
  17 |     // Verify task was created
  18 |     await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  19 |
  20 |     // Delete the task
  21 |     await page.click(`button:has-text("Delete")`);
  22 |     await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  23 |   });
  24 |
  25 |   test('should toggle task completion status', async ({ page }) => {
  26 |     // Create a task
  27 |     const taskTitle = `Test Task ${Date.now()}`;
  28 |     await page.fill('input[name="title"]', taskTitle);
  29 |     await page.fill('input[name="description"]', 'Test Description');
  30 |     await page.click('button[type="submit"]');
  31 |
  32 |     // Verify initial status
  33 |     await expect(page.locator(`button:has-text("Pending")`)).toBeVisible();
  34 |
  35 |     // Toggle status
  36 |     await page.click(`button:has-text("Pending")`);
  37 |     await expect(page.locator(`button:has-text("Completed")`)).toBeVisible();
  38 |
  39 |     // Toggle back
  40 |     await page.click(`button:has-text("Completed")`);
  41 |     await expect(page.locator(`button:has-text("Pending")`)).toBeVisible();
  42 |   });
  43 |
  44 |   test('should validate form submission', async ({ page }) => {
  45 |     // Try to submit empty form
  46 |     await page.click('button[type="submit"]');
  47 |     await expect(page.locator('text=Title is required')).toBeVisible();
  48 |
  49 |     // Submit with only title
  50 |     await page.fill('input[name="title"]', 'Test Title');
  51 |     await page.click('button[type="submit"]');
> 52 |     await expect(page.locator('text=Test Title')).toBeVisible();
     |                                                   ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  53 |   });
  54 | }); 
```