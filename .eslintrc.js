module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Add your ESLint rules here
  },
  ignorePatterns: [
    // Add patterns to ignore specific files or directories
    'path/to/ignore/**/*.js', // Example pattern to ignore specific files
    'another/path/to/ignore/', // Example pattern to ignore a directory
    /pattern-to-ignore\.js$/, // Example regular expression pattern
  ],
}
