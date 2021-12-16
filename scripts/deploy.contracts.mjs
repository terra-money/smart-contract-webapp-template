import {
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
} from '@terra-money/terra.js';
import fs from 'fs/promises';
import {
  ARTIFACTS_DIRECTORY,
  CONTRACT_ADMIN_ADDRESS,
  SAVING_DEPLOYMENT_FILES,
  CONTRACT_INIT_MESSAGES,
  CONTRACT_SENDER,
  LOCALTERRA_DEPLOY_FEE,
  LOCALTERRA_CLIENT,
} from './env.mjs';

/**
 * @param artifacts {string}
 * @param lcdClient {import('@terra-money/terra.js').LCDClient}
 * @param contractSender {import('@terra-money/terra.js').Wallet}
 * @param storeCodeFee {import('@terra-money/terra.js').Fee}
 * @param instantiateFee {import('@terra-money/terra.js').Fee}
 * @param migrateFee {import('@terra-money/terra.js').Fee}
 * @param contractAdminAddress {string} terraAddress of contract admin
 * @param savingDeploymentFiles {Array<string>}
 * @param contractInitMessages {Record<string, Object>}
 */
async function deploy({
  artifacts,
  lcdClient,
  contractSender,
  storeCodeFee,
  instantiateFee,
  migrateFee,
  contractAdminAddress,
  savingDeploymentFiles,
  contractInitMessages,
}) {
  const wasmFiles = await glob(`${artifacts}/*.wasm`);
  const wasmBaseNames = wasmFiles.map((wasmFile) =>
    path.basename(wasmFile, '.wasm'),
  );

  const contracts = [];

  for (const name of wasmBaseNames) {
    const chainID = lcdClient.config.chainID;
    const deployment = path.resolve(artifacts, `${name}.wasm.${chainID}.json`);

    const prevDeploymentExists = await fs
      .stat(deployment)
      .then(() => true)
      .catch(() => false);

    // ---------------------------------------------
    // stringify wasm files to base64 codes
    // ---------------------------------------------
    const buffer = await fs.readFile(path.resolve(artifacts, `${name}.wasm`));
    const wasmBase64 = buffer.toString('base64');

    // ---------------------------------------------
    // store wasm codes into the chain
    // ---------------------------------------------
    const storeCodeTx = await contractSender.createAndSignTx({
      msgs: [new MsgStoreCode(contractSender.key.accAddress, wasmBase64)],
      fee: storeCodeFee,
    });

    const storeCodeRes = await lcdClient.tx.broadcast(storeCodeTx);

    const codeID = storeCodeRes.logs[0].events
      .find(({ type }) => type === 'store_code')
      .attributes.find(({ key }) => key === 'code_id').value;

    // ---------------------------------------------
    // instantiate wasm codes on the chain to smart contracts
    // ---------------------------------------------
    let data;

    // instantiate contract if not prev deployment exists
    if (!prevDeploymentExists) {
      const msg = new MsgInstantiateContract(
        contractSender.key.accAddress,
        contractAdminAddress,
        +codeID,
        contractInitMessages[name],
      );

      const tx = await contractSender.createAndSignTx({
        msgs: [msg],
        fee: instantiateFee,
      });

      const res = await lcdClient.tx.broadcast(tx);

      const contractAddress = res.logs[0].events
        .find(({ type }) => type === 'instantiate_contract')
        .attributes.find(({ key }) => key === 'contract_address').value;

      data = {
        chainID,
        name,
        codeID,
        contractAddress,
      };

      contracts.push(data);
    }
    // migrate contract if prev deployment exists
    else {
      const prevData = await fs
        .readFile(deployment, { encoding: 'utf8' })
        .then(JSON.parse);

      const msg = new MsgMigrateContract(
        contractAdminAddress,
        prevData.contractAddress,
        +codeID,
        {},
      );

      const tx = await contractSender.createAndSignTx({
        msgs: [msg],
        fee: migrateFee,
      });

      const res = await lcdClient.tx.broadcast(tx);

      if (res.logs.length === 0) {
        throw new Error(res.raw_log);
      }

      data = {
        ...prevData,
        codeID,
      };

      contracts.push(data);
    }

    // ---------------------------------------------
    // register smart contracts information
    // ---------------------------------------------
    await fs.writeFile(deployment, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
    });
  }

  // ---------------------------------------------
  // save deployment info
  // ---------------------------------------------
  for (const file of savingDeploymentFiles) {
    await fs.writeFile(file, JSON.stringify(contracts, null, 2), {
      encoding: 'utf8',
    });
  }
}

switch (argv.chain) {
  case 'localterra':
    deploy({
      artifacts: ARTIFACTS_DIRECTORY,
      lcdClient: LOCALTERRA_CLIENT,
      contractSender: CONTRACT_SENDER,
      storeCodeFee: LOCALTERRA_DEPLOY_FEE,
      instantiateFee: LOCALTERRA_DEPLOY_FEE,
      migrateFee: LOCALTERRA_DEPLOY_FEE,
      contractAdminAddress: CONTRACT_ADMIN_ADDRESS,
      savingDeploymentFiles: SAVING_DEPLOYMENT_FILES,
      contractInitMessages: CONTRACT_INIT_MESSAGES,
    });
    break;
  default:
    throw new Error(`Unknown chain "${argv.chain}"`);
}
