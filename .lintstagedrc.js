module.exports = {
  '*.{js,jsx,ts,tsx,vue}': ['eslint --fix'],
  '*.{json,css,scss,md}': ['prettier --write'],
  '*.{css,scss}': ['stylelint --fix'],
};
