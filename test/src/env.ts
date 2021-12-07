import { Fee, LCDClient, LocalTerra } from '@terra-money/terra.js';
import path from 'path';

const { wallets } = new LocalTerra();

export const ROOT = path.resolve(__dirname, '../..');
export const ARTIFACTS = path.resolve(ROOT, 'artifacts');

export const CONTRACT_SENDER = wallets.validator;
export const CONTRACT_ADMIN_ADDRESS = wallets.validator.key.accAddress;
export const CONTRACT_TESTER = wallets.test1;

export const LOCALTERRA_CLIENT = new LCDClient({
  URL: 'http://localhost:3060',
  chainID: 'localterra',
  gasAdjustment: 1.6,
});

export const DEPLOY_FEE = new Fee(2000000, '1000000uluna');
export const POST_FEE = new Fee(2000000, '1000000uluna');
