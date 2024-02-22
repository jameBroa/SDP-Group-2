module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env"
        }
      ],
      'react-native-reanimated/plugin',
      "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
    ],
    
  };
};
