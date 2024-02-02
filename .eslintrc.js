module.exports = {
  root: true,
  extends: ["universe/native", "plugin:react-hooks/recommended"],
  rules: {
    "no-restricted-imports": ["error", "@rneui/base"],
  },
};
