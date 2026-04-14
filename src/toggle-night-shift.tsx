import { showToast, Toast } from "@raycast/api";
import { toggleNightShift } from "./utils/night-shift";

export default async function ToggleNightShift() {
  const toast = await showToast({ style: Toast.Style.Animated, title: "Toggling Night Shift..." });

  try {
    const result = await toggleNightShift();
    toast.style = Toast.Style.Success;
    toast.title = result.enabled ? "Night Shift: On" : "Night Shift: Off";
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to toggle Night Shift";
    toast.message = error instanceof Error ? error.message : String(error);
  }
}
