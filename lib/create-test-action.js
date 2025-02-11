module.exports = createTestAction;

const writePrettyFile = require("./write-pretty-file");

async function createTestAction() {
  await writePrettyFile(
    ".github/workflows/test.yml",
    `name: Test
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize]

jobs:
  test_matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: ["14", "16", "18"]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js \${{ matrix.node_version }}
        uses: actions/setup-node@v3
        with:
          node-version: \${{ matrix.node_version }}
          cache: npm
      - run: npm ci
      - run: npm test --ignore-scripts # run lint only once
    
  test:
    runs-on: ubuntu-latest
    needs: test_matrix
    steps:
      - run: exit 1
        if: \${{ needs.test_matrix.result != 'success' }}
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
    if: \${{ always() }}
`
  );
}
