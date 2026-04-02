import { Icon, MenuBarExtra, showHUD } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getMonitors } from "./utils/get-monitors";
import { setBrightness } from "./utils/set-brightness";
import { BRIGHTNESS_STEP, BRIGHTNESS_MIN, BRIGHTNESS_MAX } from "./constants";
import { Monitor } from "./types";

export default function BrightnessMenuBar() {
  const { data: monitors = [], isLoading, revalidate } = usePromise(getMonitors);

  const primaryMonitor = monitors[0];
  const title = primaryMonitor
    ? `${Math.round((primaryMonitor.brightness ?? 0) * 100)}%`
    : undefined;

  async function adjustBrightness(monitor: Monitor, delta: number) {
    const current = monitor.brightness ?? 0;
    const newValue = Math.round(Math.min(BRIGHTNESS_MAX, Math.max(BRIGHTNESS_MIN, current + delta)) * 10) / 10;

    try {
      await setBrightness(monitor.id, newValue);
      await revalidate();
      await showHUD(`${monitor.name}: ${Math.round(newValue * 100)}%`);
    } catch (error) {
      await showHUD(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return (
    <MenuBarExtra icon={Icon.Sun} title={title} isLoading={isLoading} tooltip="Brightness Pilot">
      {monitors.map((monitor) => (
        <MenuBarExtra.Section key={monitor.id} title={`${monitor.name} — ${Math.round((monitor.brightness ?? 0) * 100)}%`}>
          {monitor.isSupported ? (
            <>
              <MenuBarExtra.Item
                title="Increase"
                icon={Icon.Plus}
                onAction={() => adjustBrightness(monitor, BRIGHTNESS_STEP)}
              />
              <MenuBarExtra.Item
                title="Decrease"
                icon={Icon.Minus}
                onAction={() => adjustBrightness(monitor, -BRIGHTNESS_STEP)}
              />
            </>
          ) : (
            <MenuBarExtra.Item title="Not supported" icon={Icon.Warning} />
          )}
        </MenuBarExtra.Section>
      ))}
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title="Refresh" icon={Icon.ArrowClockwise} onAction={() => revalidate()} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
