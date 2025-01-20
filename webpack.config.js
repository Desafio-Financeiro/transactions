const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
    new ModuleFederationPlugin({
      name: "transactionsApp",
      library: { type: "var", name: "transactionsApp" },
      filename: "remoteEntry.js",
      exposes: {
        "./Transactions": "./src/modules/transactions/index.tsx",
        "./Extract": "./src/modules/extract/index.tsx",
      },
      shared: {
        "react-dom": {
          singleton: true,
        },
        react: {
          singleton: true,
        },
        "fiap-financeiro-ds": {
          singleton: true,
        },
        axios: {
          singleton: true,
        },
        "@material-ui": {
          singleton: true,
        },
      },
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3002,
    open: false,
  },
  mode: "development",
};
