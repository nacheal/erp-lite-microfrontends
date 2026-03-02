module.exports = {
  root: true,
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss'],
  plugins: ['stylelint-scss'],
  rules: {
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'no-descending-specificity': null,
    'declaration-block-no-duplicate-properties': true,
    'color-hex-length': 'short',
    'color-named': 'never',
  },
};
