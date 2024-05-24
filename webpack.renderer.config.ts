import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import * as path from "path";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
    },
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
