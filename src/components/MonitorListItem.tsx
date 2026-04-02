import { Action, ActionPanel, Color, Icon, List, showToast, Toast } from "@raycast/api";
import { Dispatch, SetStateAction, useRef } from "react";
import { Monitor } from "../types";
import { setBrightness } from "../utils/set-brightness";
import { ClearCacheAction } from "./ClearCacheAction";
import { BRIGHTNESS_STEP, BRIGHTNESS_MIN, BRIGHTNESS_MAX } from "../constants";

interface MonitorListItemProps {
  monitor: Monitor;
  setMonitors: Dispatch<SetStateAction<Monitor[]>>;
  revalidate?: () => Promise<Monitor[]>;
}

export function MonitorListItem({ monitor, setMonitors, revalidate }: MonitorListItemProps) {
  const isUpdatingRef = useRef(false);

  async function updateBrightness(delta: number) {
    if (isUpdatingRef.current) {
      await showToast({ style: Toast.Style.Animated, title: "Update in progress..." });
      return;
    }

    const currentBrightness = monitor.brightness ?? 0;
    const newBrightness = Math.round((currentBrightness + delta) * 10) / 10;

    if (newBrightness < BRIGHTNESS_MIN || newBrightness > BRIGHTNESS_MAX) {
      await showToast({
        style: Toast.Style.Failure,
        title: newBrightness > BRIGHTNESS_MAX ? "Maximum brightness reached" : "Minimum brightness reached",
      });
      return;
    }

    isUpdatingRef.current = true;
    try {
      await setBrightness(monitor.id, newBrightness);
      setMonitors((prev) =>
        prev.map((m) => (m.id === monitor.id ? { ...m, brightness: newBrightness } : m))
      );
      await showToast({
        style: Toast.Style.Success,
        title: `Brightness set to ${Math.round(newBrightness * 100)}%`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to set brightness",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      isUpdatingRef.current = false;
    }
  }

  const brightnessPercent = monitor.brightness != null ? `${Math.round(monitor.brightness * 100)}%` : "N/A";

  const accessories: List.Item.Accessory[] = [];

  if (monitor.isSupported && monitor.brightness != null) {
    accessories.push({ text: brightnessPercent, icon: Icon.Sun });
  } else if (!monitor.isSupported) {
    accessories.push({ tag: { value: "Not supported", color: Color.Red } });
  }

  return (
    <List.Item
      title={monitor.name}
      subtitle={`#${monitor.id}`}
      accessories={accessories}
      actions={
        <ActionPanel>
          {monitor.isSupported && (
            <ActionPanel.Section title="Brightness">
              <Action
                title="Increase Brightness"
                icon={Icon.Plus}
                onAction={() => updateBrightness(BRIGHTNESS_STEP)}
              />
              <Action
                title="Decrease Brightness"
                icon={Icon.Minus}
                onAction={() => updateBrightness(-BRIGHTNESS_STEP)}
              />
            </ActionPanel.Section>
          )}
          <ActionPanel.Section>
            <ClearCacheAction revalidate={revalidate} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
