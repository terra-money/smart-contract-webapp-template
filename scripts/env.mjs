import { Fee, LCDClient, LocalTerra } from '@terra-money/terra.js';

const { wallets } = new LocalTerra();

export const ROOT = path.resolve(__dirname, '..');
export const PROJECT_NAME = path.basename(ROOT);
export const ARTIFACTS_DIRECTORY = path.resolve(ROOT, 'artifacts');
export const SCHEMA_DIRECTORY = path.resolve(ROOT, 'schema');

export const TYPESCRIPT_OUT_FILES = [
  path.resolve(ROOT, 'app/src/contract.ts'),
  path.resolve(ROOT, 'test/src/contract.ts'),
];

// ---------------------------------------------
// contract deployment
// ---------------------------------------------
export const CONTRACT_SENDER = wallets.validator;
export const CONTRACT_ADMIN_ADDRESS = wallets.validator.key.accAddress;

export const LOCALTERRA_CLIENT = new LCDClient({
  URL: 'http://localhost:3060',
  chainID: 'localterra',
  gasAdjustment: 1.6,
});

export const LOCALTERRA_DEPLOY_FEE = new Fee(2000000, '1000000uluna');

export const SAVING_DEPLOYMENT_FILES = [
  path.resolve(ROOT, 'app/src/contracts.json'),
];

export const CONTRACT_INIT_MESSAGES = {
  counter: {
    count: 0,
  }
}