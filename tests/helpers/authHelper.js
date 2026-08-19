export async function loginUser(page) {
  await page.goto("/auth");

  await page.getByLabel("Email").fill("john@test.com");
  await page.getByLabel("Password").fill("password123");

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL(/\/groups/);
}
