import { generate } from 'cosmwasm-typescript-generator';
import { ROOT } from './env.mjs';

generate({
  root: ROOT,
  outFile: path.resolve(ROOT, 'app/src/contract.ts'),
});
