import { spawnCli } from "./spawn-cli";
import { CLIResult } from "../types";

export async function setBrightness(displayID: number, brightness: number): Promise<CLIResult> {
  const stdout = await spawnCli(["set-brightness", displayID.toString(), brightness.toString()]);

  try {
    const result = JSON.parse(stdout) as CLIResult;
    if (!result.success) {
      throw new Error(result.error || `Failed to set brightness for display ${displayID}`);
    }
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse CLI response");
    }
    throw error;
  }
}
