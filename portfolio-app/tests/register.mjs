import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register the custom loader to resolve path aliases during testing
register('./loader.mjs', pathToFileURL('./tests/'));
