// Install husky only if the `CI` environment variable is not set
process.env.CI === undefined && require('husky').install();
