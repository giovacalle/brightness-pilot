export type ConnectionType = "builtIn" | "displayPort" | "hdmi" | "unknown";

export interface Monitor {
  id: number;
  name: string;
  brightness: number;
  isBuiltIn: boolean;
  isSupported: boolean;
  connectionType: ConnectionType;
}

export interface CLIResult {
  success: boolean;
  displayID: number;
  brightness?: number;
  error?: string;
}

export interface Release {
  assets: Array<{
    name: string;
    digest: string;
    browser_download_url: string;
  }>;
}
