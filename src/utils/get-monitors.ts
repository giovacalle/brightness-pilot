import { spawnCli } from "./spawn-cli";
import { Monitor } from "../types";

export async function getMonitors(): Promise<Monitor[]> {
  const stdout = await spawnCli(["detect-displays"]);

  try {
    return JSON.parse(stdout) as Monitor[];
  } catch {
    throw new Error("Failed to parse monitor data from CLI");
  }
}
