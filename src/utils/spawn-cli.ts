import { spawn } from "child_process";
import { getCli } from "./cli";
import { CLI_TIMEOUT_MS } from "../constants";

export async function spawnCli(args: string[]): Promise<string> {
  const cli = await getCli();

  return new Promise((resolve, reject) => {
    const proc = spawn(cli, args);
    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error(`CLI timed out after ${CLI_TIMEOUT_MS}ms`));
    }, CLI_TIMEOUT_MS);

    proc.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on("error", (error: Error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start CLI: ${error.message}`));
    });

    proc.on("close", (code: number | null) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(stderr.trim() || `CLI exited with code ${code}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
