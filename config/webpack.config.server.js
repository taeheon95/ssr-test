"use strict";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const paths = require("./paths");
const modules = require("./modules");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const nodeExternals = require("webpack-node-externals");
const getClientEnvironment = require("./env");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const useTypeScript = fs.existsSync(paths.appTsConfig);

// Check if Tailwind config exists
const useTailwind = fs.existsSync(
  path.join(paths.appPath, "tailwind.config.js")
);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          config: false,
          plugins: !useTailwind
            ? [
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                "postcss-normalize",
              ]
            : [
                "tailwindcss",
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
              ],
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: shouldUseSourceMap,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const config = {
  mode: "production",
  entry: paths.ssrIndexTs,
  target: "node",
  output: {
    path: paths.ssrBuild,
    filename: "server.js",
    chunkFilename: "js/[name].chunk.js",
    publicPath: paths.publicUrlOrPath,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            exclude: /(node_modules)/,
            use: {
              loader: "swc-loader",
              options: {
                jsc: {
                  parser: {
                    syntax: "typescript",
                  },
                },
              },
            },
          },
          // {
          //   test: /\.(js|mjs|jsx|ts|tsx)$/,
          //   include: paths.appSrc,
          //   loader: require.resolve("babel-loader"),
          //   options: {
          //     customize: require.resolve(
          //       "babel-preset-react-app/webpack-overrides"
          //     ),
          //     presets: [
          //       [
          //         require.resolve("babel-preset-react-app"),
          //         {
          //           runtime: "automatic",
          //         },
          //       ],
          //     ],
          //     cacheDirectory: true,
          //     cacheCompression: false,
          //     compact: true,
          //   },
          // },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: {
                mode: "icss",
              },
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: {
                mode: "local",
                getLocalIdent: getCSSModuleLocalIdent,
              },
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: {
                  mode: "icss",
                },
              },
              "sass-loader"
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: {
                  mode: "local",
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              "sass-loader"
            ),
          },
          {
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: "asset/resource",
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: imageInlineSizeLimit,
              },
            },
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: require.resolve("@svgr/webpack"),
                options: {
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve("file-loader"),
                options: {
                  name: "static/media/[name].[hash].[ext]",
                },
              },
            ],
            issuer: {
              and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => useTypeScript || !ext.includes("ts")),
  },
  externals: [
    nodeExternals({
      allowlist: [/@babel/],
    }),
  ],
};

module.exports = config;
