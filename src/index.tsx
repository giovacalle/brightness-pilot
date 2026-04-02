import { Icon, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useEffect, useMemo, useState } from "react";
import { MonitorListItem } from "./components/MonitorListItem";
import { getMonitors } from "./utils/get-monitors";
import { Monitor, ConnectionType } from "./types";

type FilterValue = "all" | ConnectionType;

export default function Command() {
  const { data = [], isLoading, error, revalidate } = usePromise(getMonitors);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    if (data.length > 0 && monitors.length === 0) {
      setMonitors(data);
    }
  }, [data]);

  const filteredMonitors = useMemo(() => {
    if (filter === "all") return monitors;
    return monitors.filter((m) => m.connectionType === filter);
  }, [monitors, filter]);

  const builtInMonitors = filteredMonitors.filter((m) => m.isBuiltIn);
  const externalMonitors = filteredMonitors.filter((m) => !m.isBuiltIn);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search monitors..."
      searchBarAccessory={
        <List.Dropdown tooltip="Filter by connection" value={filter} onChange={(v) => setFilter(v as FilterValue)}>
          <List.Dropdown.Item title="All" value="all" />
          <List.Dropdown.Item title="Built-in" value="builtIn" icon={Icon.Monitor} />
          <List.Dropdown.Item title="DisplayPort" value="displayPort" icon={Icon.ComputerChip} />
          <List.Dropdown.Item title="HDMI" value="hdmi" icon={Icon.Link} />
        </List.Dropdown>
      }
    >
      {error ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: "#FF0000" }}
          title="Failed to load monitors"
          description={error.message}
        />
      ) : filteredMonitors.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Monitor}
          title="No monitors found"
          description={filter !== "all" ? "Try changing the filter" : "No connected displays detected"}
        />
      ) : (
        <>
          {builtInMonitors.length > 0 && (
            <List.Section title="Built-in" subtitle={`${builtInMonitors.length}`}>
              {builtInMonitors.map((monitor) => (
                <MonitorListItem
                  key={monitor.id}
                  monitor={monitor}
                  setMonitors={setMonitors}
                  revalidate={revalidate}
                />
              ))}
            </List.Section>
          )}
          {externalMonitors.length > 0 && (
            <List.Section title="External" subtitle={`${externalMonitors.length}`}>
              {externalMonitors.map((monitor) => (
                <MonitorListItem
                  key={monitor.id}
                  monitor={monitor}
                  setMonitors={setMonitors}
                  revalidate={revalidate}
                />
              ))}
            </List.Section>
          )}
        </>
      )}
    </List>
  );
}
