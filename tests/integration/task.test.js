const { test, expect } = require('@playwright/test');

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to be ready
    await page.goto('http://localhost:4173');
    await page.waitForSelector('h1:has-text("Task Manager")');
  });

  test('should create and delete a task', async ({ page }) => {
    // Create a task
    const taskTitle = `Test Task ${Date.now()}`;
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('input[name="description"]', 'Test Description');
    await page.click('button[type="submit"]');

    // Verify task was created
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();

    // Delete the task
    await page.click(`button:has-text("Delete")`);
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('should toggle task completion status', async ({ page }) => {
    // Create a task
    const taskTitle = `Test Task ${Date.now()}`;
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('input[name="description"]', 'Test Description');
    await page.click('button[type="submit"]');

    // Verify initial status
    await expect(page.locator(`button:has-text("Pending")`)).toBeVisible();

    // Toggle status
    await page.click(`button:has-text("Pending")`);
    await expect(page.locator(`button:has-text("Completed")`)).toBeVisible();

    // Toggle back
    await page.click(`button:has-text("Completed")`);
    await expect(page.locator(`button:has-text("Pending")`)).toBeVisible();
  });

  test('should validate form submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Title is required')).toBeVisible();

    // Submit with only title
    await page.fill('input[name="title"]', 'Test Title');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Title')).toBeVisible();
  });
}); 