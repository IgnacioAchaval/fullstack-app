import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test('should create and manage tasks', async ({ page }) => {
    // Go to the home page
    await page.goto('/');

    // Create a new task
    await page.fill('input[placeholder="Task title"]', 'Test Task');
    await page.fill('textarea[placeholder="Task description"]', 'Test Description');
    await page.click('button:has-text("Add Task")');

    // Verify task was created
    await expect(page.locator('text=Test Task')).toBeVisible();
    await expect(page.locator('text=Test Description')).toBeVisible();

    // Mark task as completed
    await page.click('input[type="checkbox"]');
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();

    // Delete task
    await page.click('button:has-text("Delete")');
    await expect(page.locator('text=Test Task')).not.toBeVisible();
  });
}); 