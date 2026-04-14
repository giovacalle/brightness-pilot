import { Action, ActionPanel, Form, Icon, showToast, Toast } from "@raycast/api";
import { setNightShiftStrength } from "./utils/night-shift";

interface FormValues {
  strength: string;
}

const PRESETS = [
  { title: "10%", value: "0.1" },
  { title: "20%", value: "0.2" },
  { title: "30%", value: "0.3" },
  { title: "40%", value: "0.4" },
  { title: "50%", value: "0.5" },
  { title: "60%", value: "0.6" },
  { title: "70%", value: "0.7" },
  { title: "80%", value: "0.8" },
  { title: "90%", value: "0.9" },
  { title: "100%", value: "1.0" },
];

export default function SetNightShiftStrength() {
  async function handleSubmit(values: FormValues) {
    const strength = parseFloat(values.strength);
    if (isNaN(strength) || strength < 0 || strength > 1) {
      await showToast({ style: Toast.Style.Failure, title: "Invalid strength value" });
      return;
    }

    const toast = await showToast({ style: Toast.Style.Animated, title: "Setting Night Shift..." });

    try {
      const result = await setNightShiftStrength(strength);
      toast.style = Toast.Style.Success;
      toast.title = `Night Shift set to ${Math.round(strength * 100)}%`;
      toast.message = result.enabled ? "Night Shift is on" : "Night Shift is off";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to set Night Shift";
      toast.message = error instanceof Error ? error.message : String(error);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Set Night Shift" icon={Icon.Moon} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="strength" title="Strength" defaultValue="0.5">
        {PRESETS.map((preset) => (
          <Form.Dropdown.Item key={preset.value} title={preset.title} value={preset.value} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
