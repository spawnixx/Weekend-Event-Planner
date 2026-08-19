// @ts-check
import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/authHelper.js";

test("rendering test", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "submit" })).toBeVisible();
});
test("user can log in", async ({ page }) => {
  await page.goto("/auth");
  await page.getByLabel("Email").fill("john@test.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page).toHaveURL(/\/groups/);
});
test("rejects invalid login credentials", async ({ page }) => {
  page.on("console", (msg) => {
    console.log("BROWSER:", msg.text());
  });

  page.on("pageerror", (err) => {
    console.log("PAGE ERROR:", err.message);
  });

  await page.goto("/auth");

  await page.getByLabel("Email").fill("john@test.com");
  await page.getByLabel("Password").fill("wrongpassword");

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/users/login") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: "Submit" }).click();

  const response = await responsePromise;

  console.log("STATUS:", response.status());
  console.log("CONTENT TYPE:", response.headers()["content-type"]);
  console.log("BODY:", await response.text());

  expect(response.status()).toBe(400);

  await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();

  await expect(page).toHaveURL(/\/auth/);

  await expect(
    page.locator("[data-sonner-toast]").filter({
      hasText: "Incorrect Password. Try again",
    }),
  ).toBeVisible();
});

test("unauthenticated user cannot access protected groups page", async ({
  page,
}) => {
  await page.goto("/groups");

  await expect(page).toHaveURL(/\/auth/);
});
test("user can log out", async ({ page }) => {
  await loginUser(page);

  await page.getByRole("button", { name: /logout/i }).click();

  await expect(page).toHaveURL(/\/auth/);

  await page.goto("/groups");
  await expect(page).toHaveURL(/\/auth/);
});
