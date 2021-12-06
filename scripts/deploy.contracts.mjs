import { MsgInstantiateContract, MsgStoreCode } from '@terra-money/terra.js';
import fs from 'fs/promises';
import {
  ARTIFACTS,
  CONTRACT_ADMIN_ADDRESS,
  CONTRACT_INFORMATION_TARGETS, CONTRACT_INIT_MESSAGES,
  CONTRACT_SENDER,
  DEPLOY_FEE,
  LOCALTERRA_CLIENT,
} from './env.mjs';

const wasmFiles = await glob(`${ARTIFACTS}/*.wasm`);
const wasmBaseNames = wasmFiles.map((wasmFile) =>
  path.basename(wasmFile, '.wasm'),
);

const contracts = [];

for (const name of wasmBaseNames) {
  const chainID = LOCALTERRA_CLIENT.config.chainID;
  const deployment = path.resolve(ARTIFACTS, `${name}.wasm.${chainID}.json`);

  //const prevDeploymentExists = await fs
  //  .stat(deployment)
  //  .then(() => true)
  //  .catch(() => false);

  // ---------------------------------------------
  // stringify wasm files to base64 codes
  // ---------------------------------------------
  const buffer = await fs.readFile(path.resolve(ARTIFACTS, `${name}.wasm`));
  const wasmBase64 = buffer.toString('base64');

  // ---------------------------------------------
  // store wasm codes into the chain
  // ---------------------------------------------
  const storeCodeTx = await CONTRACT_SENDER.createAndSignTx({
    msgs: [new MsgStoreCode(CONTRACT_SENDER.key.accAddress, wasmBase64)],
    fee: DEPLOY_FEE,
  });

  const storeCodeRes = await LOCALTERRA_CLIENT.tx.broadcast(storeCodeTx);

  const codeId = storeCodeRes.logs[0].events
    .find(({ type }) => type === 'store_code')
    .attributes.find(({ key }) => key === 'code_id').value;

  // ---------------------------------------------
  // instantiate wasm codes on the chain to smart contracts
  // ---------------------------------------------
  const instantiateTx = await CONTRACT_SENDER.createAndSignTx({
    msgs: [
      new MsgInstantiateContract(
        CONTRACT_SENDER.key.accAddress,
        CONTRACT_ADMIN_ADDRESS,
        +codeId,
        CONTRACT_INIT_MESSAGES[name],
      ),
    ],
    fee: DEPLOY_FEE,
  });

  const instantiateRes = await LOCALTERRA_CLIENT.tx.broadcast(instantiateTx);

  const contractAddress = instantiateRes.logs[0].events
    .find(({ type }) => type === 'instantiate_contract')
    .attributes.find(({ key }) => key === 'contract_address').value;

  // ---------------------------------------------
  // register smart contracts information
  // ---------------------------------------------
  const data = {
    chainID,
    name,
    codeId,
    contractAddress,
  };

  contracts.push(data);

  await fs.writeFile(deployment, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
}

for (const file of CONTRACT_INFORMATION_TARGETS) {
  await fs.writeFile(file, JSON.stringify(contracts, null, 2), {
    encoding: 'utf8',
  });
}
