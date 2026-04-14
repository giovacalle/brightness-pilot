import { spawnCli } from "./spawn-cli";
import { NightShiftStatus, NightShiftResult } from "../types";

export async function getNightShiftStatus(): Promise<NightShiftStatus> {
  const stdout = await spawnCli(["night-shift", "status"]);

  try {
    return JSON.parse(stdout) as NightShiftStatus;
  } catch {
    throw new Error("Failed to parse Night Shift status");
  }
}

export async function toggleNightShift(): Promise<NightShiftResult> {
  const stdout = await spawnCli(["night-shift", "toggle"]);

  try {
    const result = JSON.parse(stdout) as NightShiftResult;
    if (!result.success) {
      throw new Error(result.error || "Failed to toggle Night Shift");
    }
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse CLI response");
    }
    throw error;
  }
}

export async function setNightShiftStrength(strength: number): Promise<NightShiftResult> {
  const stdout = await spawnCli(["night-shift", "set", strength.toString()]);

  try {
    const result = JSON.parse(stdout) as NightShiftResult;
    if (!result.success) {
      throw new Error(result.error || "Failed to set Night Shift strength");
    }
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse CLI response");
    }
    throw error;
  }
}
