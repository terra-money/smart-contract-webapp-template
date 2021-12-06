import { generate } from 'cosmwasm-typescript-generator';
import { ROOT } from './env.mjs';

generate({
  schemaDir: path.resolve(ROOT, 'schema'),
  outFile: path.resolve(ROOT, 'app/src/contract.ts'),
});
