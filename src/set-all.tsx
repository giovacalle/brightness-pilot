import { Action, ActionPanel, Form, Icon, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getMonitors } from "./utils/get-monitors";
import { setBrightness } from "./utils/set-brightness";

interface FormValues {
  brightness: string;
}

const PRESETS = [
  { title: "25%", value: "0.25" },
  { title: "50%", value: "0.5" },
  { title: "75%", value: "0.75" },
  { title: "100%", value: "1.0" },
];

export default function SetAllBrightness() {
  const { data: monitors = [], isLoading } = usePromise(getMonitors);

  const supportedMonitors = monitors.filter((m) => m.isSupported);

  async function handleSubmit(values: FormValues) {
    const brightness = parseFloat(values.brightness);
    if (isNaN(brightness) || brightness < 0 || brightness > 1) {
      await showToast({ style: Toast.Style.Failure, title: "Invalid brightness value" });
      return;
    }

    const toast = await showToast({ style: Toast.Style.Animated, title: "Setting brightness..." });

    const results = await Promise.allSettled(
      supportedMonitors.map((m) => setBrightness(m.id, brightness))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed === 0) {
      toast.style = Toast.Style.Success;
      toast.title = `Brightness set to ${Math.round(brightness * 100)}% on ${succeeded} monitor${succeeded > 1 ? "s" : ""}`;
    } else {
      toast.style = Toast.Style.Failure;
      toast.title = `${succeeded} succeeded, ${failed} failed`;
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Set Brightness" icon={Icon.Sun} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text={`${supportedMonitors.length} supported monitor${supportedMonitors.length !== 1 ? "s" : ""} detected`} />
      <Form.Dropdown id="brightness" title="Brightness" defaultValue="0.5">
        {PRESETS.map((preset) => (
          <Form.Dropdown.Item key={preset.value} title={preset.title} value={preset.value} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
