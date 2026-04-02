# Brightness Pilot

A Raycast extension to detect, monitor, and control the brightness of all connected displays on macOS — built-in, DisplayPort, USB-C, and HDMI.

Powered by [brightness-cli](https://github.com/giovacalle/brightness-cli).

## Features

- **Show Monitors** — List all displays with current brightness, connection type, and controls
- **Brightness Status** — Menu bar icon showing current brightness with quick adjust
- **Set All Brightness** — Set brightness for all monitors at once with presets
- **Connection Awareness** — Color-coded tags for Built-in, DisplayPort, HDMI
- **HDMI Support** — DDC brightness control over HDMI (Apple Silicon)

## Commands

| Command | Description | Mode |
|---------|-------------|------|
| Show Monitors | List displays with brightness +/- controls | View |
| Brightness Status | Menu bar with brightness % and quick controls | Menu Bar |
| Set All Brightness | Set all monitors to a preset value | View |

## Installation

```bash
git clone https://github.com/giovacalle/brightness-pilot.git
cd brightness-pilot
npm install
npm run dev
```

The extension automatically downloads the latest `brightness-cli` binary on first use.

## Requirements

- macOS 13.0+
- Apple Silicon Mac
- [Raycast](https://raycast.com)

## Credits

- [brightness-cli](https://github.com/giovacalle/brightness-cli) — Swift CLI for display brightness control
- [AppleSiliconDDC](https://github.com/waydabber/AppleSiliconDDC) — DDC protocol library
