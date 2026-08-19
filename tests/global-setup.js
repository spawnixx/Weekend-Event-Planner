import { resetAndSeedE2EDatabase } from "./helpers/seed.js";

export default async function globalSetup() {
  await resetAndSeedE2EDatabase();
}
