import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/authHelper.js";
import { resetAndSeedE2EDatabase } from "./helpers/seed.js";

test.beforeEach(async () => {
  console.log("RESET START");

  await resetAndSeedE2EDatabase();

  console.log("RESET DONE");
});

test("Render test", async ({ page }) => {
  await page.goto("/groups");
  await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "submit" })).toBeVisible();
});
test("user can create a group", async ({ page }) => {
  await loginUser(page);
  await expect(page).toHaveURL(/\/groups/);

  await page.getByRole("button", { name: /Create New Group/i }).click();
});
test("user can open a created group", async ({ page }) => {
  await loginUser(page);
  await expect(page).toHaveURL(/\/groups/);
  await page.getByRole("button", { name: /Create New Group/i }).click();
  await page.getByLabel(/group name/i).fill("Weekend Crew");
  await page.getByRole("button", { name: /Create Group/i }).click();

  await page.getByText("Weekend Crew", { exact: true }).click();

  await expect(page).toHaveURL(/\/groups\/\d+/);

  await expect(
    page.getByRole("heading", { name: "Weekend Crew" }),
  ).toBeVisible();
});
test("owner can open member management", async ({ page }) => {
  await loginUser(page);
  await expect(page).toHaveURL(/\/groups/);
  await page.getByRole("button", { name: /Create New Group/i }).click();
  await expect(page.getByRole("dialog").toBeVisible());
  await page.getByLabel(/Group Name/i).fill("Weekend Crew");
  await page.getByRole("button", { name: /Create Group/i }).click();

  await page.getByText("Weekend Crew", { exact: true }).click();

  await page.getByRole("button", { name: /Manage Group/i }).click();

  await page.getByRole("menuitem", { name: /Manage Members/i }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(page.getByText(/Group Members/i)).toBeVisible();

  await expect(page.getByText(/owner/i)).toBeVisible();
});
