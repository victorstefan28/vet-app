import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";

import { MakerRpm } from "@electron-forge/maker-rpm";

import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: "*.node",
    },
    name: "Cabinet veterinar",
  },

  rebuildConfig: {},
  makers: [
    new MakerSquirrel(
      {
        authors: "Paul Vasile",
        description: "Aplicatie gestiune cabinet veterinar",
        name: "Cabinet veterinar",
        setupExe: "CabinetVeterinar.exe",
        setupIcon: "./src/assets/paw.ico",
      },
      ["win32"]
    ),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
    // new MakerDMG({}, ["darwin"]),
  ],

  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
  ],
};

export default config;
