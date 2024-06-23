module.exports = (api) => {
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: ["react-native-reanimated/plugin"],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
