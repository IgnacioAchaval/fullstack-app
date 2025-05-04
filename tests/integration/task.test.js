const { test, expect } = require('@playwright/test');

// Get the frontend port from the environment or use default
const FRONTEND_PORT = process.env.FRONTEND_PORT || '4173';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to be ready
    await page.goto(`http://localhost:${FRONTEND_PORT}`);
    await page.waitForSelector('h1:has-text("Task Manager")');
  });

  test('should create and delete a task', async ({ page }) => {
    // Click Add Task button
    await page.click('button:has-text("Add Task")');

    // Create a task
    const taskTitle = `Test Task ${Date.now()}`;
    await page.fill('label:has-text("Title") + div input', taskTitle);
    await page.fill('label:has-text("Description") + div textarea', 'Test Description');
    await page.click('button:has-text("Save")');

    // Verify task was created
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();

    // Delete the task
    await page.click(`button:has-text("Delete")`);
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('should toggle task completion status', async ({ page }) => {
    // Click Add Task button
    await page.click('button:has-text("Add Task")');

    // Create a task
    const taskTitle = `Test Task ${Date.now()}`;
    await page.fill('label:has-text("Title") + div input', taskTitle);
    await page.fill('label:has-text("Description") + div textarea', 'Test Description');
    await page.selectOption('label:has-text("Status") + div select', 'completed');
    await page.click('button:has-text("Save")');

    // Verify status
    await expect(page.locator(`text=Status: completed`)).toBeVisible();

    // Click Add Task button again
    await page.click('button:has-text("Add Task")');

    // Update status
    await page.fill('label:has-text("Title") + div input', taskTitle);
    await page.fill('label:has-text("Description") + div textarea', 'Test Description');
    await page.selectOption('label:has-text("Status") + div select', 'pending');
    await page.click('button:has-text("Save")');

    // Verify status changed
    await expect(page.locator(`text=Status: pending`)).toBeVisible();
  });

  test('should validate form submission', async ({ page }) => {
    // Click Add Task button
    await page.click('button:has-text("Add Task")');

    // Try to submit empty form
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Title is required')).toBeVisible();

    // Submit with only title
    await page.fill('label:has-text("Title") + div input', 'Test Title');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Test Title')).toBeVisible();
  });
}); 