import fs from "fs";
// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Di cloud Claude, pakai Chromium yang sudah terpasang (unduhan Chrome dari remotion.media diblokir).
const CLOUD_CHROME =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(CLOUD_CHROME)) {
  Config.setBrowserExecutable(CLOUD_CHROME);
}
Config.setChromiumOpenGlRenderer("swangle");
