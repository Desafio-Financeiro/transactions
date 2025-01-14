const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.tsx", // Ponto de entrada principal
  output: {
    path: path.resolve(__dirname, "dist"), // Pasta de saída
    filename: "bundle.js", // Nome do arquivo gerado
    clean: true, // Limpa a pasta dist antes de cada build
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Extensões suportadas
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Processa arquivos TypeScript e TSX
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/, // Processa arquivos CSS
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Modelo do HTML
      filename: "index.html", // Nome do arquivo gerado
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
      },
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"), // Servir arquivos da pasta dist
    port: 3002, // Porta do servidor de desenvolvimento
    open: true, // Abre o navegador automaticamente
  },
  mode: "development", // Define o modo como desenvolvimento
};
