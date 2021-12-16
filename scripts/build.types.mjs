import { generate } from 'cosmwasm-typescript-generator';
import { SCHEMA_DIRECTORY, TYPESCRIPT_OUT_FILES } from './env.mjs';

generate({
  schemaDir: SCHEMA_DIRECTORY,
  outFile: TYPESCRIPT_OUT_FILES,
});
