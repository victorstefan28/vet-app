import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import * as path from "path";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      "@": path.resolve(__dirname, "src/"),
    },
  },
  externals: {
    "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
    sqlite3: "commonjs sqlite3",
  },
  devtool: "source-map",
};
