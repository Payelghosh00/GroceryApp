module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    'react-native-reanimated/plugin', // Add this line
  ],
   env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
